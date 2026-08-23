'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Panel, ProductShell, inputClass } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { BusinessReputation, BusinessUsage, Organization } from '@/lib/types'

export function BusinessDashboard() {
  const { t } = useI18n()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<Record<string, unknown>[]>([])
  const [invites, setInvites] = useState<Record<string, unknown>[]>([])
  const [reputation, setReputation] = useState<BusinessReputation | null>(null)
  const [theme, setTheme] = useState<{ logoUrl: string | null; brandColor: string | null }>({ logoUrl: null, brandColor: null })
  const [usage, setUsage] = useState<BusinessUsage | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(true)

  const load = useCallback(async () => {
    setBusy(true); setMessage('')
    const results = await Promise.allSettled([
      api<Organization>('/business/organization'),
      api<Record<string, unknown>[]>('/business/members'),
      api<Record<string, unknown>[]>('/business/invites'),
      api<BusinessReputation>('/business/reputation'),
      api<{ logoUrl: string | null; brandColor: string | null }>('/business/theme'),
      api<BusinessUsage>('/business/usage'),
    ])
    if (results[0].status === 'fulfilled') setOrganization(results[0].value)
    if (results[1].status === 'fulfilled') setMembers(results[1].value)
    if (results[2].status === 'fulfilled') setInvites(results[2].value)
    if (results[3].status === 'fulfilled') setReputation(results[3].value)
    if (results[4].status === 'fulfilled') setTheme(results[4].value)
    if (results[5].status === 'fulfilled') setUsage(results[5].value)
    const failure = results.find(result => result.status === 'rejected')
    if (failure?.status === 'rejected') setMessage(errorMessage(failure.reason, t('error')))
    setBusy(false)
  }, [t])
  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function saveOrganization() {
    if (!organization) return
    setBusy(true); setMessage('')
    try {
      const payload = {
        name: organization.name,
        description: organization.description || null,
        website: organization.website || null,
        logoUrl: organization.logoUrl || null,
      }
      setOrganization(await api<Organization>('/business/organization', { method: 'PATCH', body: JSON.stringify(payload) }))
      setMessage(t('complete'))
    } catch (cause) { setMessage(errorMessage(cause, t('error'))) } finally { setBusy(false) }
  }
  async function invite(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      await api('/business/invites', { method: 'POST', body: JSON.stringify({ email: inviteEmail }) })
      setInviteEmail(''); setMessage(t('complete')); await load()
    } catch (cause) { setMessage(errorMessage(cause, t('error'))) } finally { setBusy(false) }
  }

  async function saveTheme() {
    setBusy(true); setMessage('')
    try {
      const payload = {
        logoUrl: theme.logoUrl || null,
        ...(theme.brandColor ? { brandColor: theme.brandColor } : {}),
      }
      setTheme(await api<{ logoUrl: string | null; brandColor: string | null }>('/business/theme', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }))
      setMessage(t('complete'))
    } catch (cause) { setMessage(errorMessage(cause, t('error'))) } finally { setBusy(false) }
  }

  return <ProductShell role="business"><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Organization workspace</p><h1 className="mt-2 text-4xl font-semibold">{t('business')}</h1></div><Button variant="outline" onClick={() => void load()}>{t('refresh')}</Button></div>
    {message && <p role="status" className="mt-5 rounded-xl bg-white p-3 text-sm">{message}</p>}
    {busy && !organization ? <p className="py-20 text-center" aria-busy="true">{t('loading')}</p> :
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <Panel title={t('organizationProfile')}><div className="grid gap-4"><label className="grid gap-2 text-sm">{t('name')}<input className={inputClass} value={organization?.name || ''} onChange={e => setOrganization(current => current ? { ...current, name: e.target.value } : { id: '', name: e.target.value })} /></label><label className="grid gap-2 text-sm">{t('description')}<textarea className={`${inputClass} min-h-24 py-3`} value={organization?.description || ''} onChange={e => setOrganization(current => current ? { ...current, description: e.target.value } : null)} /></label><label className="grid gap-2 text-sm">{t('website')}<input type="url" className={inputClass} value={organization?.website || ''} onChange={e => setOrganization(current => current ? { ...current, website: e.target.value } : null)} /></label><label className="grid gap-2 text-sm">{t('logoUrl')}<input type="url" className={inputClass} value={organization?.logoUrl || ''} onChange={e => setOrganization(current => current ? { ...current, logoUrl: e.target.value } : null)} /></label><Button disabled={busy || !organization} onClick={() => void saveOrganization()}>{t('save')}</Button></div></Panel>
      <Panel title={t('reputation')}><p className="text-6xl font-semibold tracking-[-.08em]">{reputation ? reputation.averageReputation.toFixed(1) : '—'}</p><p className="mt-3 text-sm text-muted-foreground">{reputation?.ratingCount || 0} {t('basedOn')} · Average rating {reputation?.averageRating.toFixed(1) || '—'}</p></Panel>
      <Panel title={t('roster')}><form onSubmit={invite} className="flex gap-2"><input required type="email" className={inputClass} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder={t('email')} /><Button disabled={busy}>Invite · دعوة</Button></form><div className="mt-5 grid gap-2">{members.length ? members.map((member, index) => <div key={String(member.id || index)} className="rounded-xl bg-[#f7f8f4] p-3 text-sm"><strong>{String((member.user as Record<string, unknown> | undefined)?.name || 'Member')}</strong><span className="ms-2 text-muted-foreground">{String((member.user as Record<string, unknown> | undefined)?.email || '')}</span></div>) : <p className="text-sm text-muted-foreground">{t('noData')}</p>}</div><h3 className="mt-6 text-sm font-semibold">Invites · الدعوات</h3><ul className="mt-2 grid gap-2 text-sm">{invites.map((item, index) => <li key={String(item.id || index)} className="flex justify-between rounded-xl border p-3"><span>{String(item.email)}</span><span>{String(item.status)}</span></li>)}</ul></Panel>
      <Panel title={t('brandedTheme')}><div className="grid gap-4"><label className="grid gap-2 text-sm">{t('logoUrl')}<input type="url" className={inputClass} value={theme.logoUrl || ''} onChange={e => setTheme(current => ({ ...current, logoUrl: e.target.value }))} /></label><label className="grid gap-2 text-sm">{t('brandColor')}<input type="color" className="h-11 w-full rounded-xl border p-1" value={theme.brandColor || '#17352c'} onChange={e => setTheme(current => ({ ...current, brandColor: e.target.value }))} /></label><Button disabled={busy} onClick={() => void saveTheme()}>{t('save')}</Button></div></Panel>
      <Panel title={t('usage')}><div className="grid gap-3 text-sm"><p><strong>{t('plan')}:</strong> {usage?.plan || '—'} · {usage?.status || '—'}</p><p>Members · الأعضاء: {usage?.usage.members || 0}</p><p>Pending invites · الدعوات المعلقة: {usage?.usage.pendingInvites || 0}</p><ul className="grid gap-2">{usage?.entitlements.map(item => <li key={item.key} className="flex justify-between rounded-xl bg-[#f7f8f4] p-3"><span>{item.key}</span><strong>{item.value}</strong></li>)}</ul></div></Panel>
    </div>}
  </main></ProductShell>
}
