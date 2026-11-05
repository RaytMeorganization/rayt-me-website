'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader, ProductShell, inputClass } from '@/components/product/shell'
import { ErrorBanner, LoadingBlock, RecordShell, StatusBadge } from '@/components/product/dashboard-ui'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import { formatAdminDate } from '@/components/product/interactive-value'
import { formatScoreValue, type BusinessRatingItem } from '@/lib/business-analytics'

export function TeamRatingsFeed({
  employees,
}: {
  employees: { id: string; name: string }[]
}) {
  const { t } = useI18n()
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', [])
  const [employeeId, setEmployeeId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [items, setItems] = useState<BusinessRatingItem[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const sentinel = useRef<HTMLDivElement>(null)

  const queryBase = useMemo(() => {
    const params = new URLSearchParams({ limit: '20', timeZone })
    if (employeeId) params.set('employeeId', employeeId)
    if (from && to) {
      params.set('from', from)
      params.set('to', to)
    }
    return params
  }, [employeeId, from, timeZone, to])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      void api<{ items: BusinessRatingItem[]; nextCursor: string | null }>(`/business/ratings?${queryBase.toString()}`, { signal: controller.signal })
        .then((page) => {
          setItems(page.items)
          setCursor(page.nextCursor)
          setLoading(false)
        })
        .catch((cause: unknown) => {
          if (controller.signal.aborted) return
          setError(errorMessage(cause, t('error')))
          setLoading(false)
        })
    }, 0)
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [queryBase, t])

  useEffect(() => {
    const node = sentinel.current
    if (!node || !cursor) return
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      const next = cursor
      setCursor(null)
      const params = new URLSearchParams(queryBase)
      params.set('cursor', next)
      void api<{ items: BusinessRatingItem[]; nextCursor: string | null }>(`/business/ratings?${params.toString()}`)
        .then((page) => {
          setItems((current) => {
            const seen = new Set(current.map((item) => item.id))
            return [...current, ...page.items.filter((item) => !seen.has(item.id))]
          })
          setCursor(page.nextCursor)
        })
        .catch((cause: unknown) => setError(errorMessage(cause, t('error'))))
    }, { rootMargin: '240px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [cursor, queryBase, t])

  return (
    <ProductShell role="business">
      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:px-8">
        <PageHeader
          eyebrow={t('business')}
          title={t('allTeamRatings')}
          description={t('allTeamRatingsHelp')}
          action={<Link className="text-sm font-semibold text-emerald-700" href="/business-dashboard">{t('backToDashboard')}</Link>}
        />
        <div className="flex flex-wrap gap-3">
          <label className="grid gap-1 text-xs text-muted-foreground">
            {t('filterEmployee')}
            <select className={inputClass} value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
              <option value="">{t('entireTeam')}</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {t('periodStart')}
            <input className={inputClass} type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {t('periodEndDate')}
            <input className={inputClass} type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
        </div>
        {error ? <ErrorBanner message={error} retryLabel={t('retry')} onRetry={() => setEmployeeId((current) => current)} /> : null}
        {loading ? <LoadingBlock rows={4} /> : null}
        {!loading && !items.length ? <p className="text-sm text-muted-foreground">{t('noRatingsInPeriod')}</p> : null}
        <div className="grid gap-2">
          {items.map((rating) => (
            <RecordShell
              key={rating.id}
              title={`${rating.rater?.name || rating.attributionTitle || '—'} → ${rating.target?.name ?? '—'}`}
              subtitle={[formatAdminDate(rating.createdAt), rating.direction, rating.channel, [rating.ratingCity, rating.ratingCountry].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
              badges={<StatusBadge tone="muted">{formatScoreValue(rating.r)}</StatusBadge>}
            />
          ))}
        </div>
        <div ref={sentinel} className="h-8" />
      </main>
    </ProductShell>
  )
}
