'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/product/providers'

type Request = { message: string; destructive: boolean; resolve: (ok: boolean) => void }

let enqueue: ((request: Request) => void) | null = null

/**
 * Styled replacement for window.confirm. Resolves true when the user confirms.
 * Falls back to window.confirm if no host is mounted.
 */
export function confirmAction(message: string, options: { destructive?: boolean } = {}): Promise<boolean> {
  if (!enqueue) return Promise.resolve(window.confirm(message))
  return new Promise(resolve => enqueue?.({ message, destructive: options.destructive ?? true, resolve }))
}

/** Mount once inside the i18n provider. Uses a native modal <dialog> for focus trapping, Esc and inert background. */
export function ConfirmDialogHost() {
  const { t } = useI18n()
  const ref = useRef<HTMLDialogElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const [request, setRequest] = useState<Request | null>(null)

  useEffect(() => {
    enqueue = next => setRequest(next)
    return () => { enqueue = null }
  }, [])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (request && !dialog.open) {
      dialog.showModal()
      confirmRef.current?.focus()
    } else if (!request && dialog.open) {
      dialog.close()
    }
  }, [request])

  function finish(ok: boolean) {
    request?.resolve(ok)
    setRequest(null)
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      onCancel={event => { event.preventDefault(); finish(false) }}
      onClick={event => { if (event.target === event.currentTarget) finish(false) }}
      className="m-auto w-[min(92vw,28rem)] rounded-2xl border border-white/10 bg-card p-0 text-foreground shadow-[0_24px_80px_-20px_rgba(0,0,0,0.9)] backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {request ? (
        <div className="grid gap-4 p-6">
          <div className="flex items-start gap-3">
            <span className={request.destructive ? 'mt-0.5 rounded-full bg-destructive/15 p-2 text-destructive' : 'mt-0.5 rounded-full bg-primary/15 p-2 text-primary'}>
              <AlertTriangle className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="confirm-dialog-title" className="font-serif text-lg font-semibold">{t('confirmDialogTitle')}</h2>
              <p id="confirm-dialog-message" className="mt-1 text-sm leading-6 text-muted-foreground">{request.message}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => finish(false)}>{t('confirmDialogCancel')}</Button>
            <Button
              ref={confirmRef}
              type="button"
              variant={request.destructive ? 'destructive' : 'default'}
              onClick={() => finish(true)}
            >
              {t('confirmDialogConfirm')}
            </Button>
          </div>
        </div>
      ) : null}
    </dialog>
  )
}
