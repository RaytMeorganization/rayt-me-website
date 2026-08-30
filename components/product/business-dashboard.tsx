'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, ProductShell, inputClass } from '@/components/product/shell'
import { EmptyState, Illustration, StatCard } from '@/components/product/brand-art'
import { AnimatedNumber } from '@/components/product/premium-motion'
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
  const [inviteRole, setInviteRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(true)
  const [ready, setReady] = useState(false)

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
    if (failure?.status === 'rejected') setMessage(errorMessage(failure.reason, t('loadFailed')))
    setBusy(false); setReady(true)
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
      const created = await api<{ devToken?: string }>('/business/invites', {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      setInviteEmail('')
      setMessage(created.devToken ? `${t('inviteLink')}: ${window.location.origin}/accept-invite?token=${created.devToken}` : t('complete'))
      await load()
    } catch (cause) { setMessage(errorMessage(cause, t('error'))) } finally { setBusy(false) }
  }

  async function revokeInvite(id: string) {
    if (!window.confirm(t('confirmRevoke'))) return
    setBusy(true); setMessage('')
    try {
      await api(`/business/invites/${encodeURIComponent(id)}`, { method: 'DELETE' })
      await load()
    } catch (cause) { setMessage(errorMessage(cause, t('error'))) } finally { setBusy(false) }
  }

  async function removeMember(id: string) {
    if (!window.confirm(t('confirmRemoveMember'))) return
    setBusy(true); setMessage('')
    try {
      await api(`/business/members/${encodeURIComponent(id)}`, { method: 'DELETE' })
      await load()
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
    <PageHeader
      eyebrow={t('organizationWorkspace')}
      title={organization?.name || t('business')}
      description={t('businessIntro')}
      action={<Button variant="outline" onClick={() => void load()}>{t('refresh')}</Button>}
    />
    {message && <p role="status" className="mt-5 rounded-xl border border-[#eae2d1] bg-white p-3 text-sm text-[#11213D]">{message}</p>}

    {!ready ? <div aria-busy="true" className="mt-8 grid gap-6 lg:grid-cols-2">{[0, 1, 2, 3].map(card => <div key={card} className="h-64 animate-pulse rounded-3xl bg-[#eef2ec]" />)}</div> : <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('reputation')} value={reputation ? reputation.averageReputation.toFixed(1) : '—'} hint={`${reputation?.ratingCount ?? 0} ${t('basedOn')}`} />
        <StatCard label={t('averageRating')} value={reputation ? reputation.averageRating.toFixed(1) : '—'} hint={t('ratingCount')} />
        <StatCard label={t('members')} value={String(usage?.usage.members ?? members.length)} hint={t('roster')} />
        <StatCard label={t('plan')} value={usage?.plan || '—'} hint={usage?.status || t('status')} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={t('organizationProfile')}>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">{t('name')}<input className={inputClass} value={organization?.name || ''} onChange={e => setOrganization(current => current ? { ...current, name: e.target.value } : { id: '', name: e.target.value })} /></label>
            <label className="grid gap-2 text-sm">{t('description')}<textarea className={`${inputClass} min-h-24 py-3`} value={organization?.description || ''} onChange={e => setOrganization(current => current ? { ...current, description: e.target.value } : null)} /></label>
            <label className="grid gap-2 text-sm">{t('website')}<input type="url" className={inputClass} value={organization?.website || ''} onChange={e => setOrganization(current => current ? { ...current, website: e.target.value } : null)} /></label>
            <label className="grid gap-2 text-sm">{t('logoUrl')}<input type="url" className={inputClass} value={organization?.logoUrl || ''} onChange={e => setOrganization(current => current ? { ...current, logoUrl: e.target.value } : null)} /></label>
            <Button disabled={busy || !organization} onClick={() => void saveOrganization()}>{busy ? t('saving') : t('save')}</Button>
          </div>
        </Panel>

        <Panel title={t('reputation')}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-6xl font-semibold tabular-nums tracking-[-.08em] text-[#11213D]">{reputation ? <AnimatedNumber value={reputation.averageReputation} decimals={1} /> : '—'}</p>
              <p className="mt-3 text-sm text-[#5c6b64]">{reputation?.ratingCount || 0} {t('basedOn')}</p>
            </div>
            <Illustration kind="reputation" className="w-32 shrink-0" />
          </div>
        </Panel>

        <Panel title={t('roster')} description={t('emptyRosterHelp')}>
          <form onSubmit={invite} className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input required type="email" className={inputClass} value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder={t('email')} />
            <select aria-label={t('role')} className={`${inputClass} sm:w-40`} value={inviteRole} onChange={event => setInviteRole(event.target.value as 'MEMBER' | 'ADMIN')}>
              <option value="MEMBER">{t('memberRole')}</option>
              <option value="ADMIN">{t('organizationAdminRole')}</option>
            </select>
            <Button type="submit" disabled={busy}>{t('invite')}</Button>
          </form>
          {members.length ? <div className="mt-5 grid gap-2">{members.map((member, index) => <div key={String(member.id || index)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#faf6ee] p-3 text-sm">
            <span className="min-w-0">
              <strong className="text-[#11213D]">{String((member.user as Record<string, unknown> | undefined)?.name || t('members'))}</strong>
              <span className="ms-2 text-[#5c6b64]">{String((member.user as Record<string, unknown> | undefined)?.email || '')}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="rounded-full bg-white px-2 py-1 text-xs text-[#5c6b64]">{String(member.role)}</span>
              {String(member.role) !== 'ADMIN' && <Button size="sm" variant="outline" disabled={busy} onClick={() => void removeMember(String(member.id))}>{t('remove')}</Button>}
            </span>
          </div>)}</div> : <EmptyState kind="roster" title={t('emptyRoster')} description={t('emptyRosterHelp')} />}
          <h3 className="mt-6 text-sm font-semibold text-[#11213D]">{t('pendingInvites')}</h3>
          {invites.length ? <ul className="mt-2 grid gap-2 text-sm">{invites.map((item, index) => <li key={String(item.id || index)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eae2d1] p-3">
            <span className="text-[#11213D]">{String(item.email)}</span>
            <span className="flex items-center gap-2">
              <span className="text-[#5c6b64]">{String(item.status)}</span>
              {String(item.status) === 'PENDING' && <Button size="sm" variant="outline" disabled={busy} onClick={() => void revokeInvite(String(item.id))}>{t('revoke')}</Button>}
            </span>
          </li>)}</ul> : <p className="mt-2 text-sm text-[#7a8780]">{t('emptyInvites')}</p>}
        </Panel>

        <Panel title={t('brandedTheme')}>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm">{t('logoUrl')}<input type="url" className={inputClass} value={theme.logoUrl || ''} onChange={e => setTheme(current => ({ ...current, logoUrl: e.target.value }))} /></label>
            <label className="grid gap-2 text-sm">{t('brandColor')}<input type="color" aria-label={t('brandColor')} className="h-11 w-full rounded-xl border border-[#eae2d1] bg-white p-1" value={theme.brandColor || '#11213D'} onChange={e => setTheme(current => ({ ...current, brandColor: e.target.value }))} /></label>
            <Button disabled={busy} onClick={() => void saveTheme()}>{busy ? t('saving') : t('save')}</Button>
          </div>
        </Panel>

        <Panel title={t('usage')} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label={t('plan')} value={usage?.plan || '—'} hint={usage?.status || t('status')} />
            <StatCard label={t('members')} value={String(usage?.usage.members ?? 0)} />
            <StatCard label={t('pendingInvites')} value={String(usage?.usage.pendingInvites ?? 0)} />
          </div>
          <h3 className="mt-6 text-sm font-semibold text-[#11213D]">{t('entitlements')}</h3>
          {usage?.entitlements.length ? <ul className="mt-2 grid gap-2 sm:grid-cols-2">{usage.entitlements.map(item => <li key={item.key} className="flex justify-between rounded-xl bg-[#faf6ee] p-3 text-sm">
            <span className="text-[#5c6b64]">{item.key}</span><strong className="text-[#11213D]">{item.value}</strong>
          </li>)}</ul> : <p className="mt-2 text-sm text-[#7a8780]">{t('noData')}</p>}
        </Panel>
      </div>
    </>}
  </main></ProductShell>
}
