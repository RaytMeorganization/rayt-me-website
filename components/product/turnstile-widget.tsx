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
          'error-callback'?: () => void
          'expired-callback'?: () => void
          action?: string
          size?: 'normal' | 'compact' | 'flexible' | 'invisible'
          appearance?: 'always' | 'execute' | 'interaction-only'
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

const SCRIPT_ID = 'cf-turnstile-script'

export type TurnstileWidgetHandle = {
  reset: () => void
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

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useImperativeHandle(ref, () => ({
    reset() {
      onTokenRef.current(null)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    },
  }))

  useEffect(() => {
    let cancelled = false
    const sitekey = turnstileSiteKey()

    function mount() {
      if (cancelled || !hostRef.current || !window.turnstile) return
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
      widgetIdRef.current = window.turnstile.render(hostRef.current, {
        sitekey,
        action,
        size: 'invisible',
        appearance: 'interaction-only',
        callback: (token) => onTokenRef.current(token),
        'error-callback': () => onTokenRef.current(null),
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
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [action])

  return <div ref={hostRef} className="cf-turnstile" />
})
