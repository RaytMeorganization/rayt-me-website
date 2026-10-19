'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AdminUserPasswordPanel } from '@/components/product/admin-user-password-panel'
import { useI18n } from '@/components/product/providers'

type ContactRow = { label: string; value: string; status?: string }

function contactRows(dossier: Record<string, unknown>, t: ReturnType<typeof useI18n>['t']): ContactRow[] {
  const rows: ContactRow[] = []
  const push = (label: string, value: unknown, status?: unknown) => {
    const text = value != null ? String(value).trim() : ''
    if (!text) return
    rows.push({
      label,
      value: text,
      status: status != null ? String(status) : undefined,
    })
  }
  push(t('email'), dossier.email)
  push(t('personalEmail'), dossier.personalEmail, dossier.personalEmailStatus)
  push(t('workEmail'), dossier.workEmail, dossier.workEmailStatus)
  push(t('universityEmail'), dossier.universityEmail, dossier.universityEmailStatus)
  push(t('phone'), dossier.phone, dossier.phoneStatus)
  return rows
}

export function AdminUserRecordSheet({
  open,
  onOpenChange,
  dossier,
  loading,
  loadError,
  busy,
  onRetry,
  onPasswordSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dossier: Record<string, unknown> | null
  loading?: boolean
  loadError?: string
  busy?: boolean
  onRetry?: () => void
  onPasswordSave: (password: string) => void | Promise<void>
}) {
  const { t } = useI18n()
  const name = dossier?.name ? String(dossier.name) : t('userRecord')
  const contacts = dossier ? contactRows(dossier, t) : []

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-white/10 pb-4">
          <SheetTitle className="font-serif text-xl">{name}</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {t('adminUserRecordHint')}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {t('loading')}
            </p>
          ) : null}

          {loadError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">{loadError}</p>
              {onRetry ? (
                <Button type="button" size="sm" variant="outline" className="mt-3" onClick={onRetry}>
                  {t('retry')}
                </Button>
              ) : null}
            </div>
          ) : null}

          {!loading && !loadError ? (
            <>
              <section>
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('adminContactDetails')}
                </h3>
                {contacts.length ? (
                  <ul className="mt-3 grid gap-3">
                    {contacts.map(row => (
                      <li
                        key={row.label}
                        className="rounded-xl border border-white/10 bg-muted/10 px-4 py-3"
                      >
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{row.label}</p>
                        <p className="mt-1 break-all text-sm font-medium text-foreground">{row.value}</p>
                        {row.status ? (
                          <p className="mt-1 text-xs text-muted-foreground">{row.status}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{t('noData')}</p>
                )}
              </section>

              {dossier?.stats ? (
                <p className="text-sm text-muted-foreground">
                  {t('score')}: {String(dossier.score ?? '—')} · {t('ratingsGiven')}:{' '}
                  {String((dossier.stats as { ratingsGiven?: number }).ratingsGiven ?? 0)} ·{' '}
                  {t('ratingsReceived')}:{' '}
                  {String((dossier.stats as { ratingsReceived?: number }).ratingsReceived ?? 0)}
                </p>
              ) : null}

              <section>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t('adminUpdatePassword')}
                </h3>
                <AdminUserPasswordPanel busy={busy} onSave={onPasswordSave} />
              </section>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
