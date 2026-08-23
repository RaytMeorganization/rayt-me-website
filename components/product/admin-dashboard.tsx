'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Panel, ProductShell } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'

const sections = [
  ['overview', 'overview', 'overview'], ['users', 'users', 'users'], ['verifications', 'queue', 'verifications'],
  ['disputes', 'disputes', 'disputes'], ['organizations', 'organizations', 'organizations'],
  ['plans', 'plans', 'plans'], ['audit', 'audit', 'audit-log'], ['health', 'health', 'health'], ['analytics', 'analytics', 'analytics'],
] as const

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

export function AdminDashboard() {
  const { t } = useI18n()
  const [section, setSection] = useState<(typeof sections)[number][0]>('overview')
  const [records, setRecords] = useState<unknown[]>([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setBusy(true); setError('')
    const endpoint = sections.find(([key]) => key === section)?.[2] || 'overview'
    try { setRecords(normalize(await api<unknown>(`/admin/${endpoint}`))) }
    catch (cause) { setError(errorMessage(cause, t('error'))); setRecords([]) }
    finally { setBusy(false) }
  }, [section, t])
  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function review(item: Record<string, unknown>, status: 'verified' | 'rejected' | 'resolved') {
    if (!window.confirm(status === 'resolved' ? 'Resolve this dispute? · هل تريد حل الاعتراض؟' : `${status === 'verified' ? 'Approve' : 'Reject'} this verification? · تأكيد الإجراء؟`)) return
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

  return <ProductShell role="admin"><main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Operations</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{t('admin')}</h1></div><Button variant="outline" onClick={() => void load()}>{t('refresh')}</Button></div>
    <nav aria-label={t('admin')} className="mt-8 flex gap-2 overflow-x-auto pb-2">{sections.map(([key, label]) => <Button key={key} variant={section === key ? 'default' : 'outline'} onClick={() => setSection(key)} className="shrink-0">{t(label)}</Button>)}</nav>
    <Panel title={t(sections.find(([key]) => key === section)?.[1] || 'overview')} className="mt-5">
      {busy ? <p aria-busy="true" className="py-16 text-center text-sm text-muted-foreground">{t('loading')}</p> : error ? <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : records.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">{t('noData')}</p> :
      <div className="grid gap-3">{records.map((record, index) => {
        const item = record as Record<string, unknown>
        const id = String(item?.id || item?.label || index)
        return <article key={id} className="rounded-2xl border border-[#e1e6e1] bg-[#fafbf8] p-4">
          <div className="flex flex-wrap items-start justify-between gap-4"><dl className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">{Object.entries(item).map(([key, value]) => <div key={key} className="min-w-0"><dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{key}</dt><dd className="mt-1 break-words text-sm">{displayValue(value)}</dd></div>)}</dl>
          {(section === 'verifications' || section === 'disputes') && (item?.id || item?.userId || item?.ratingId) ? <div className="flex gap-2">{section === 'verifications' && <><Button size="sm" onClick={() => void review(item, 'verified')}>Approve · قبول</Button><Button size="sm" variant="outline" onClick={() => void review(item, 'rejected')}>Reject · رفض</Button></>}{section === 'disputes' && <Button size="sm" onClick={() => void review(item, 'resolved')}>Resolve · حل</Button>}</div> : null}</div>
        </article>
      })}</div>}
    </Panel>
  </main></ProductShell>
}
