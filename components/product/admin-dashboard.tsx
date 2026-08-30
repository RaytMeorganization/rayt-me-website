'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, ProductShell } from '@/components/product/shell'
import { EmptyState, StatCard } from '@/components/product/brand-art'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'

const sections = [
  ['overview', 'overview', 'overview', 'overview'],
  ['users', 'users', 'users', 'roster'],
  ['verifications', 'queue', 'verifications', 'queue'],
  ['ratings', 'ratings', 'ratings', 'reputation'],
  ['disputes', 'disputes', 'disputes', 'disputes'],
  ['organizations', 'organizations', 'organizations', 'roster'],
  ['plans', 'plans', 'plans', 'plans'],
  ['audit', 'audit', 'audit-log', 'audit'],
  ['health', 'health', 'health', 'reputation'],
  ['analytics', 'analytics', 'analytics', 'plans'],
] as const

type SectionKey = (typeof sections)[number][0]
type VerificationType = 'personalEmail' | 'workEmail' | 'universityEmail' | 'phone'

const verificationFields: { type: VerificationType; status: string }[] = [
  { type: 'personalEmail', status: 'personalEmailStatus' },
  { type: 'workEmail', status: 'workEmailStatus' },
  { type: 'universityEmail', status: 'universityEmailStatus' },
  { type: 'phone', status: 'phoneStatus' },
]

function normalize(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object' && Array.isArray((value as { items?: unknown[] }).items)) return (value as { items: unknown[] }).items
  if (value && typeof value === 'object') return Object.entries(value).map(([label, data]) => ({ label, data }))
  return value == null ? [] : [value]
}

function displayValue(value: unknown) {
  if (value == null) return '—'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const humanize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/[_-]+/g, ' ').trim()

/** Overview returns a flat counter map, which reads far better as stat tiles. */
function isStatEntry(record: unknown): record is { label: string; data: string | number | boolean } {
  const item = record as { label?: unknown; data?: unknown } | null
  return typeof item?.label === 'string' && (typeof item.data === 'string' || typeof item.data === 'number' || typeof item.data === 'boolean')
}

export function AdminDashboard() {
  const { t } = useI18n()
  const [section, setSection] = useState<SectionKey>('overview')
  const [records, setRecords] = useState<unknown[]>([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const active = sections.find(([key]) => key === section) ?? sections[0]

  const load = useCallback(async () => {
    setBusy(true); setError('')
    const endpoint = sections.find(([key]) => key === section)?.[2] || 'overview'
    const query = section === 'users' && search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
    try { setRecords(normalize(await api<unknown>(`/admin/${endpoint}${query}`))) }
    catch (cause) { setError(errorMessage(cause, t('loadFailed'))); setRecords([]) }
    finally { setBusy(false) }
  }, [search, section, t])
  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function review(item: Record<string, unknown>, status: 'verified' | 'rejected' | 'resolved' | 'dismissed', type?: VerificationType) {
    const prompt = status === 'resolved' ? t('confirmResolve') : status === 'dismissed' ? t('confirmDismiss') : status === 'verified' ? t('confirmApprove') : t('confirmReject')
    if (!window.confirm(prompt)) return
    setBusy(true); setError('')
    try {
      if (section === 'verifications') {
        if (!type) throw new Error(t('verificationTypeMissing'))
        const userId = String(item.userId || (item.user as Record<string, unknown> | undefined)?.id || item.id)
        await api(`/admin/verifications/${encodeURIComponent(userId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ type, status }),
        })
      } else {
        const ratingId = String(item.ratingId || item.id)
        await api(`/admin/disputes/${encodeURIComponent(ratingId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        })
      }
      await load()
    } catch (cause) { setError(errorMessage(cause, t('error'))); setBusy(false) }
  }

  async function updateUser(item: Record<string, unknown>, data: { role?: string; isActive?: boolean }) {
    setBusy(true); setError('')
    try {
      await api(`/admin/users/${encodeURIComponent(String(item.id))}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      await load()
    } catch (cause) { setError(errorMessage(cause, t('error'))); setBusy(false) }
  }

  async function updatePlan(item: Record<string, unknown>, active: boolean) {
    setBusy(true); setError('')
    try {
      await api(`/admin/plans/${encodeURIComponent(String(item.id))}`, {
        method: 'PATCH',
        body: JSON.stringify({ active }),
      })
      await load()
    } catch (cause) { setError(errorMessage(cause, t('error'))); setBusy(false) }
  }

  async function createRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setBusy(true); setError('')
    try {
      if (section === 'organizations') {
        await api('/admin/organizations', {
          method: 'POST',
          body: JSON.stringify({ name: values.name, slug: values.slug }),
        })
      } else if (section === 'plans') {
        await api('/admin/plans', {
          method: 'POST',
          body: JSON.stringify({
            name: values.name,
            code: values.code,
            priceCents: Number(values.priceCents),
            entitlements: {},
          }),
        })
      }
      form.reset()
      await load()
    } catch (cause) { setError(errorMessage(cause, t('error'))); setBusy(false) }
  }

  async function moderateRating(item: Record<string, unknown>, isHidden: boolean) {
    setBusy(true); setError('')
    try {
      await api(`/admin/ratings/${encodeURIComponent(String(item.id))}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ isHidden }),
      })
      await load()
    } catch (cause) { setError(errorMessage(cause, t('error'))); setBusy(false) }
  }

  async function updateOrganization(item: Record<string, unknown>, data: { name?: string; website?: string | null }) {
    setBusy(true); setError('')
    try {
      await api(`/admin/organizations/${encodeURIComponent(String(item.id))}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      await load()
    } catch (cause) { setError(errorMessage(cause, t('error'))); setBusy(false) }
  }

  async function upsertEntitlement(event: React.FormEvent<HTMLFormElement>, planId: string) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    const key = String(values.key || '')
    if (!key) return
    setBusy(true); setError('')
    try {
      await api(`/admin/plans/${encodeURIComponent(planId)}/entitlements/${encodeURIComponent(key)}`, {
        method: 'PUT',
        body: JSON.stringify({ value: Number(values.value) }),
      })
      event.currentTarget.reset()
      await load()
    } catch (cause) { setError(errorMessage(cause, t('error'))); setBusy(false) }
  }

  const statEntries = records.filter(isStatEntry)
  const showStats = statEntries.length > 0 && statEntries.length === records.length

  return <ProductShell role="admin"><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
    <PageHeader
      eyebrow={t('operations')}
      title={t('admin')}
      description={t('adminIntro')}
      action={<Button variant="outline" onClick={() => void load()}>{t('refresh')}</Button>}
    />
    <nav aria-label={t('admin')} className="mt-8 flex gap-2 overflow-x-auto pb-2">
      {sections.map(([key, label]) => <button
        key={key}
        type="button"
        onClick={() => setSection(key)}
        aria-current={section === key ? 'true' : undefined}
        className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${section === key ? 'bg-[#11213D] font-semibold text-white' : 'border border-[#eae2d1] bg-white text-[#4a5a53] hover:border-[#2E6B4C]/40'}`}
      >{t(label)}</button>)}
    </nav>
    <Panel title={t(active[1])} className="mt-5">
      {section === 'users' && <form className="mb-5 flex gap-2" onSubmit={event => { event.preventDefault(); void load() }}>
        <input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('search')} className="h-10 flex-1 rounded-xl border border-[#eae2d1] bg-white px-3 text-sm text-[#11213D]" />
        <Button type="submit" variant="outline">{t('search')}</Button>
      </form>}
      {(section === 'organizations' || section === 'plans') && <details className="mb-5 rounded-2xl border border-[#eae2d1] bg-[#faf6ee] p-4">
        <summary className="cursor-pointer text-sm font-semibold text-[#11213D]">
          {section === 'organizations' ? t('createOrganization') : t('createPlan')}
        </summary>
        <form onSubmit={createRecord} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1 text-xs font-semibold text-[#5c6b64]">{t('name')}
            <input required name="name" className="h-10 rounded-xl border border-[#eae2d1] bg-white px-3 text-sm text-[#11213D]" />
          </label>
          {section === 'organizations' ? <label className="grid gap-1 text-xs font-semibold text-[#5c6b64]">{t('slug')}
            <input required name="slug" pattern="[a-z0-9-]+" className="h-10 rounded-xl border border-[#eae2d1] bg-white px-3 text-sm text-[#11213D]" />
          </label> : <>
            <label className="grid gap-1 text-xs font-semibold text-[#5c6b64]">{t('code')}
              <input required name="code" pattern="[a-z0-9-]+" className="h-10 rounded-xl border border-[#eae2d1] bg-white px-3 text-sm text-[#11213D]" />
            </label>
            <label className="grid gap-1 text-xs font-semibold text-[#5c6b64]">{t('price')}
              <input required min="0" step="1" type="number" name="priceCents" className="h-10 rounded-xl border border-[#eae2d1] bg-white px-3 text-sm text-[#11213D]" />
            </label>
          </>}
          <Button type="submit" disabled={busy} className="self-end">{t('create')}</Button>
        </form>
      </details>}
      {busy ? <div aria-busy="true" className="grid gap-3">{[0, 1, 2].map(row => <div key={row} className="h-20 animate-pulse rounded-2xl bg-[#eef2ec]" />)}</div>
      : error ? <div role="alert" className="grid gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="justify-self-start" onClick={() => void load()}>{t('retry')}</Button>
        </div>
      : records.length === 0 ? <EmptyState kind={active[3]} title={t('emptySection')} description={t('emptySectionHelp')} action={<Button variant="outline" onClick={() => void load()}>{t('refresh')}</Button>} />
      : showStats ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{statEntries.map(entry => <StatCard key={entry.label} label={humanize(entry.label)} value={String(entry.data)} />)}</div>
      : <div className="grid gap-3">{records.map((record, index) => {
        const item = record as Record<string, unknown>
        const id = String(item?.id || item?.label || index)
        return <article key={id} className="rounded-2xl border border-[#e1e6e1] bg-[#fafbf8] p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <dl className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">{Object.entries(item).map(([key, value]) => <div key={key} className="min-w-0">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-[#7a8780]">{humanize(key)}</dt>
              <dd className="mt-1 break-words text-sm text-[#11213D]">{displayValue(value)}</dd>
            </div>)}</dl>
            {section === 'verifications' && item.id ? <div className="grid min-w-56 gap-2">
              {verificationFields.filter(field => {
                const required = item.accountType === 'student'
                  ? field.type === 'personalEmail' || field.type === 'universityEmail'
                  : field.type === 'personalEmail' || field.type === 'workEmail' || field.type === 'phone'
                return required && item[field.status] === 'pending'
              }).map(field => <div key={field.type} className="rounded-xl border border-[#eae2d1] bg-white p-3">
                <p className="mb-2 text-xs font-semibold text-[#11213D]">{t(field.type)}</p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => void review(item, 'verified', field.type)}>{t('approve')}</Button>
                  <Button size="sm" variant="outline" onClick={() => void review(item, 'rejected', field.type)}>{t('reject')}</Button>
                </div>
              </div>)}
            </div> : null}
            {section === 'disputes' && (item.id || item.ratingId) ? <div className="flex gap-2">
              <Button size="sm" onClick={() => void review(item, 'resolved')}>{t('resolve')}</Button>
              <Button size="sm" variant="outline" onClick={() => void review(item, 'dismissed')}>{t('dismiss')}</Button>
            </div> : null}
            {section === 'ratings' && item.id ? <Button size="sm" variant="outline" onClick={() => void moderateRating(item, !Boolean(item.isHidden))}>
              {Boolean(item.isHidden) ? t('showRating') : t('hideRating')}
            </Button> : null}
            {section === 'organizations' && item.id ? <form className="grid min-w-52 gap-2" onSubmit={event => {
              event.preventDefault()
              const values = Object.fromEntries(new FormData(event.currentTarget))
              void updateOrganization(item, { name: String(values.name || item.name), website: values.website ? String(values.website) : null })
            }}>
              <input name="name" defaultValue={String(item.name || '')} className="h-9 rounded-lg border border-[#eae2d1] px-2 text-sm" aria-label={t('name')} />
              <input name="website" defaultValue={String(item.website || '')} className="h-9 rounded-lg border border-[#eae2d1] px-2 text-sm" aria-label={t('website')} />
              <Button size="sm" type="submit">{t('save')}</Button>
            </form> : null}
            {section === 'plans' && item.id ? <form className="grid min-w-52 gap-2" onSubmit={event => void upsertEntitlement(event, String(item.id))}>
              <input name="key" required placeholder={t('entitlementKey')} className="h-9 rounded-lg border border-[#eae2d1] px-2 text-sm" />
              <input name="value" required type="number" min="0" placeholder={t('entitlementValue')} className="h-9 rounded-lg border border-[#eae2d1] px-2 text-sm" />
              <Button size="sm" type="submit">{t('save')}</Button>
            </form> : null}
            {section === 'users' && item.id ? <div className="grid min-w-44 gap-2">
              <label className="grid gap-1 text-xs font-semibold text-[#5c6b64]">{t('role')}
                <select
                  className="h-9 rounded-lg border border-[#eae2d1] bg-white px-2 text-sm text-[#11213D]"
                  value={String(item.role)}
                  onChange={event => void updateUser(item, { role: event.target.value })}
                >
                  <option value="USER">{t('userRole')}</option>
                  <option value="BUSINESS_ADMIN">{t('businessRole')}</option>
                  <option value="PLATFORM_ADMIN">{t('adminRole')}</option>
                </select>
              </label>
              <Button size="sm" variant="outline" onClick={() => void updateUser(item, { isActive: !Boolean(item.isActive) })}>
                {Boolean(item.isActive) ? t('deactivate') : t('activate')}
              </Button>
            </div> : null}
            {section === 'plans' && item.id ? <Button size="sm" variant="outline" onClick={() => void updatePlan(item, !Boolean(item.active))}>
              {Boolean(item.active) ? t('deactivate') : t('activate')}
            </Button> : null}
          </div>
        </article>
      })}</div>}
    </Panel>
  </main></ProductShell>
}
