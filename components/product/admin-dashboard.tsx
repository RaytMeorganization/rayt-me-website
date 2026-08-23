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
  ['disputes', 'disputes', 'disputes', 'disputes'],
  ['organizations', 'organizations', 'organizations', 'roster'],
  ['plans', 'plans', 'plans', 'plans'],
  ['audit', 'audit', 'audit-log', 'audit'],
  ['health', 'health', 'health', 'reputation'],
  ['analytics', 'analytics', 'analytics', 'plans'],
] as const

type SectionKey = (typeof sections)[number][0]

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

  const active = sections.find(([key]) => key === section) ?? sections[0]

  const load = useCallback(async () => {
    setBusy(true); setError('')
    const endpoint = sections.find(([key]) => key === section)?.[2] || 'overview'
    try { setRecords(normalize(await api<unknown>(`/admin/${endpoint}`))) }
    catch (cause) { setError(errorMessage(cause, t('loadFailed'))); setRecords([]) }
    finally { setBusy(false) }
  }, [section, t])
  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function review(item: Record<string, unknown>, status: 'verified' | 'rejected' | 'resolved') {
    const prompt = status === 'resolved' ? t('confirmResolve') : status === 'verified' ? t('confirmApprove') : t('confirmReject')
    if (!window.confirm(prompt)) return
    setBusy(true); setError('')
    try {
      if (section === 'verifications') {
        const userId = String(item.userId || (item.user as Record<string, unknown> | undefined)?.id || item.id)
        await api(`/admin/verifications/${encodeURIComponent(userId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ type: item.type, status }),
        })
      } else {
        const ratingId = String(item.ratingId || item.id)
        await api(`/admin/disputes/${encodeURIComponent(ratingId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'resolved' }),
        })
      }
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
        className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${section === key ? 'bg-[#17352c] font-semibold text-white' : 'border border-[#d9dfd9] bg-white text-[#4a5a53] hover:border-emerald-700/40'}`}
      >{t(label)}</button>)}
    </nav>
    <Panel title={t(active[1])} className="mt-5">
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
              <dd className="mt-1 break-words text-sm text-[#17352c]">{displayValue(value)}</dd>
            </div>)}</dl>
            {(section === 'verifications' || section === 'disputes') && (item?.id || item?.userId || item?.ratingId) ? <div className="flex gap-2">
              {section === 'verifications' && <>
                <Button size="sm" onClick={() => void review(item, 'verified')}>{t('approve')}</Button>
                <Button size="sm" variant="outline" onClick={() => void review(item, 'rejected')}>{t('reject')}</Button>
              </>}
              {section === 'disputes' && <Button size="sm" onClick={() => void review(item, 'resolved')}>{t('resolve')}</Button>}
            </div> : null}
          </div>
        </article>
      })}</div>}
    </Panel>
  </main></ProductShell>
}
