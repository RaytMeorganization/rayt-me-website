'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, ProductShell } from '@/components/product/shell'
import { EmptyState } from '@/components/product/brand-art'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'

function AcceptInvite() {
  const { t } = useI18n()
  const { refresh } = useAuth()
  const router = useRouter()
  const token = useSearchParams().get('token')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [accepted, setAccepted] = useState(false)

  async function accept() {
    if (!token) return
    setBusy(true); setError('')
    try {
      await api('/invitations/accept', { method: 'POST', body: JSON.stringify({ token }) })
      await refresh()
      setAccepted(true)
    } catch (cause) { setError(errorMessage(cause, t('error'))) } finally { setBusy(false) }
  }

  return <main className="mx-auto max-w-2xl px-5 py-10 lg:px-8">
    <PageHeader eyebrow={t('organizationWorkspace')} title={t('acceptInvite')} description={t('acceptInviteHelp')} />
    <Panel title={t('acceptInvite')} className="mt-8">
      {!token ? <EmptyState kind="locked" title={t('inviteTokenMissing')} description={t('inviteTokenMissingHelp')} />
      : accepted ? <EmptyState
          kind="roster"
          title={t('inviteAccepted')}
          description={t('inviteAcceptedHelp')}
          action={<Button className="bg-[#11213D]" onClick={() => router.replace('/settings')}>{t('goToWorkspace')}</Button>}
        />
      : <div className="grid gap-4">
          <p className="text-sm leading-6 text-[#5c6b64]">{t('acceptInviteHelp')}</p>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <Button disabled={busy} className="bg-[#11213D]" onClick={() => void accept()}>{busy ? t('saving') : t('acceptInvite')}</Button>
            <Button variant="outline" render={<Link href="/settings" />}>{t('settings')}</Button>
          </div>
        </div>}
    </Panel>
  </main>
}

export default function AcceptInvitePage() {
  return <ProductShell>
    <Suspense fallback={null}>
      <AcceptInvite />
    </Suspense>
  </ProductShell>
}
