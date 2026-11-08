'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BusinessRatingsTable } from '@/components/product/analytics/business-ratings-table'
import { ErrorBanner, LoadingBlock } from '@/components/product/dashboard-ui'
import { PageHeader, ProductShell, inputClass } from '@/components/product/shell'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { PaginatedBusinessRatings } from '@/lib/types'

type MemberOption = { id: string; name: string }

export function TeamRatingsView() {
  const { t } = useI18n()
  const [items, setItems] = useState<PaginatedBusinessRatings>({ items: [], nextCursor: null })
  const [members, setMembers] = useState<MemberOption[]>([])
  const [employeeId, setEmployeeId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [busy, setBusy] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams({ limit: '25' })
    if (employeeId) params.set('employeeId', employeeId)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    return params.toString()
  }, [employeeId, from, to])

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const [page, roster] = await Promise.all([
        api<PaginatedBusinessRatings>(`/business/ratings?${query}`),
        api<Array<{ user?: { id?: string; name?: string } }>>('/business/members'),
      ])
      setItems(page)
      setMembers(
        roster
          .map(row => ({
            id: String(row.user?.id ?? ''),
            name: String(row.user?.name ?? ''),
          }))
          .filter(row => row.id),
      )
    } catch (cause) {
      setError(errorMessage(cause, t('analyticsLoadFailed')))
    } finally {
      setBusy(false)
    }
  }, [query, t])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function loadMore() {
    if (!items.nextCursor) return
    setLoadingMore(true)
    try {
      const page = await api<PaginatedBusinessRatings>(
        `/business/ratings?${query}&cursor=${encodeURIComponent(items.nextCursor)}`,
      )
      setItems(current => ({ items: [...current.items, ...page.items], nextCursor: page.nextCursor }))
    } catch (cause) {
      setError(errorMessage(cause, t('analyticsLoadFailed')))
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <ProductShell role="business">
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <PageHeader
          eyebrow={t('businessDashboardTitle')}
          title={t('ratingsFeed')}
          description={t('ratingsFeedHelp')}
          action={
            <Button nativeButton={false} variant="outline" size="sm" render={<Link href="/business-dashboard" />}>
              {t('backToDashboard')}
            </Button>
          }
        />
        <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-card/80 p-4 sm:grid-cols-3">
          <label className="text-xs text-muted-foreground">
            {t('filterEmployee')}
            <select className={`${inputClass} mt-1`} value={employeeId} onChange={event => setEmployeeId(event.target.value)}>
              <option value="">{t('filterAllEmployees')}</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted-foreground">
            {t('dateFrom')}
            <input type="date" className={`${inputClass} mt-1`} value={from} onChange={event => setFrom(event.target.value)} />
          </label>
          <label className="text-xs text-muted-foreground">
            {t('dateTo')}
            <input type="date" className={`${inputClass} mt-1`} value={to} onChange={event => setTo(event.target.value)} />
          </label>
        </div>
        {error ? (
          <div className="mt-5">
            <ErrorBanner message={error} onRetry={() => void load()} retryLabel={t('retry')} />
          </div>
        ) : null}
        <div className="mt-6 rounded-2xl border border-white/10 bg-card/90 p-5">
          {busy ? <LoadingBlock rows={4} /> : <BusinessRatingsTable items={items.items} />}
          {items.nextCursor ? (
            <Button className="mt-4" variant="outline" disabled={loadingMore} onClick={() => void loadMore()}>
              {loadingMore ? t('loading') : t('loadMore')}
            </Button>
          ) : null}
        </div>
      </main>
    </ProductShell>
  )
}
