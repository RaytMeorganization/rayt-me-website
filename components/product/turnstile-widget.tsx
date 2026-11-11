'use client'

import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import { turnstileSiteKey } from '@/lib/web-rating'

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: (code?: string) => void
          'expired-callback'?: () => void
          action?: string
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact' | 'flexible' | 'invisible'
          appearance?: 'always' | 'execute' | 'interaction-only'
          execution?: 'render' | 'execute'
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
      execute: (container?: string | HTMLElement, parameters?: Record<string, unknown>) => void
      getResponse: (widgetId?: string) => string | undefined
    }
  }
}

const SCRIPT_ID = 'cf-turnstile-script'

export type TurnstileWidgetHandle = {
  reset: () => void
  /** Run the challenge and resolve with a fresh token (or reject). */
  execute: () => Promise<string>
}

export const TurnstileWidget = forwardRef<
  TurnstileWidgetHandle,
  {
    onToken: (token: string | null) => void
    /** Maps to Turnstile `action` and must match server expectedAction. */
    action: string
  }
>(function TurnstileWidget({ onToken, action }, ref) {
  const hostRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  const pendingRef = useRef<{
    resolve: (token: string) => void
    reject: (error: Error) => void
  } | null>(null)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current(null)
      pendingRef.current = null
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    },
    execute() {
      return new Promise<string>((resolve, reject) => {
        if (!hostRef.current || !window.turnstile || !widgetIdRef.current) {
          reject(new Error('Bot check is still loading. Please wait a moment.'))
          return
        }
        const existing = window.turnstile.getResponse?.(widgetIdRef.current)?.trim()
        if (existing) {
          onTokenRef.current(existing)
          resolve(existing)
          return
        }
        pendingRef.current = { resolve, reject }
        try {
          window.turnstile.reset(widgetIdRef.current)
          window.turnstile.execute(hostRef.current)
        } catch (error) {
          pendingRef.current = null
          reject(error instanceof Error ? error : new Error('Bot check failed'))
        }
        window.setTimeout(() => {
          if (pendingRef.current) {
            pendingRef.current.reject(new Error('Bot check timed out. Please try again.'))
            pendingRef.current = null
          }
        }, 20_000)
      })
    },
  }))

  useEffect(() => {
    let cancelled = false
    const sitekey = turnstileSiteKey()

    function settleToken(token: string) {
      onTokenRef.current(token)
      if (pendingRef.current) {
        pendingRef.current.resolve(token)
        pendingRef.current = null
      }
    }

    function settleError(message: string) {
      onTokenRef.current(null)
      if (pendingRef.current) {
        pendingRef.current.reject(new Error(message))
        pendingRef.current = null
      }
    }

    function mount() {
      if (cancelled || !hostRef.current || !window.turnstile) return
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
      // Managed widget (Spin default). Auto-runs on render; execute() retries on demand.
      widgetIdRef.current = window.turnstile.render(hostRef.current, {
        sitekey,
        action,
        theme: 'dark',
        size: 'flexible',
        appearance: 'always',
        execution: 'render',
        callback: (token) => settleToken(token),
        'error-callback': () => settleError('Bot check failed. Please try again.'),
        'expired-callback': () => onTokenRef.current(null),
      })
    }

    const existing = document.getElementById(SCRIPT_ID)
    if (window.turnstile) {
      mount()
    } else if (existing) {
      existing.addEventListener('load', mount)
    } else {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = mount
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      pendingRef.current = null
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [action])

  return <div ref={hostRef} className="cf-turnstile min-h-[65px]" />
})
