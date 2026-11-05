'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { PageHeader, ProductShell, inputClass } from '@/components/product/shell'
import { DashboardSurface, ErrorBanner, LoadingBlock, RecordShell, StatusBadge } from '@/components/product/dashboard-ui'
import { ReputationHistoryChart } from '@/components/product/reputation-history-chart'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import { formatAdminDate } from '@/components/product/interactive-value'
import {
  formatScoreChange,
  formatScoreValue,
  type BusinessRatingItem,
  type EmployeeReputation,
  type HistoryPoint,
} from '@/lib/business-analytics'

function directionLabel(direction: EmployeeReputation['direction'], t: ReturnType<typeof useI18n>['t']) {
  if (direction === 'positive') return t('scoreUp')
  if (direction === 'negative') return t('scoreDown')
  if (direction === 'unchanged') return t('scoreUnchanged')
  return t('historyUnavailable')
}

export function EmployeeReputationPage({ employeeId }: { employeeId: string }) {
  const { t } = useI18n()
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', [])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [reputation, setReputation] = useState<EmployeeReputation | null>(null)
  const [points, setPoints] = useState<HistoryPoint[]>([])
  const [ratings, setRatings] = useState<BusinessRatingItem[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const range = from && to ? `&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&timeZone=${encodeURIComponent(timeZone)}` : ''

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      const signal = controller.signal
      void Promise.all([
        api<EmployeeReputation>(`/business/employees/${encodeURIComponent(employeeId)}/reputation?timeZone=${encodeURIComponent(timeZone)}${range}`, { signal }),
        api<{ points: HistoryPoint[] }>(`/business/employees/${encodeURIComponent(employeeId)}/reputation/history?timeZone=${encodeURIComponent(timeZone)}${range}`, { signal }),
        api<{ items: BusinessRatingItem[]; nextCursor: string | null }>(`/business/employees/${encodeURIComponent(employeeId)}/ratings?limit=20&timeZone=${encodeURIComponent(timeZone)}${range}`, { signal }),
      ])
        .then(([nextReputation, history, page]) => {
          setReputation(nextReputation)
          setPoints(history.points)
          setRatings(page.items)
          setCursor(page.nextCursor)
          setLoading(false)
        })
        .catch((cause: unknown) => {
          if (signal.aborted) return
          setError(errorMessage(cause, t('error')))
          setLoading(false)
        })
    }, 0)
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [employeeId, range, t, timeZone])

  async function loadMore() {
    if (!cursor) return
    setLoadingMore(true)
    try {
      const page = await api<{ items: BusinessRatingItem[]; nextCursor: string | null }>(
        `/business/employees/${encodeURIComponent(employeeId)}/ratings?limit=20&cursor=${encodeURIComponent(cursor)}&timeZone=${encodeURIComponent(timeZone)}${range}`,
      )
      setRatings((current) => [...current, ...page.items])
      setCursor(page.nextCursor)
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
    } finally {
      setLoadingMore(false)
    }
  }

  const employee = reputation?.employee
  const periodThroughToday = !from || !to

  return (
    <ProductShell role="business">
      <main className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:px-8">
        <PageHeader
          eyebrow={t('business')}
          title={employee?.name ?? t('reputationDetail')}
          description={employee?.jobTitle ?? t('reputationDetailHelp')}
          action={<Link className="text-sm font-semibold text-emerald-700" href="/business-dashboard?tab=team">{t('backToRoster')}</Link>}
        />
        <div className="flex flex-wrap gap-3">
          <label className="grid gap-1 text-xs text-muted-foreground">
            {t('periodStart')}
            <input className={inputClass} type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {t('periodEndDate')}
            <input className={inputClass} type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
        </div>
        {error ? <ErrorBanner message={error} retryLabel={t('retry')} onRetry={() => setFrom((current) => current)} /> : null}
        {loading ? <LoadingBlock rows={4} /> : null}
        {!loading && reputation && employee ? (
          <>
            <DashboardSurface title={t('employeeSummary')}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="grid size-16 place-items-center overflow-hidden rounded-2xl bg-white/5">
                  {employee.avatarUrl ? (
                    <Image src={employee.avatarUrl} alt="" width={64} height={64} unoptimized className="size-full object-cover" />
                  ) : (
                    <span className="font-serif text-xl">{employee.name.slice(0, 1)}</span>
                  )}
                </div>
                <div>
                  <p className="font-serif text-2xl">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.jobTitle || '—'}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {employee.isVerified ? t('verified') : t('pending')}
                    {employee.employmentStatus ? ` · ${t(employee.employmentStatus === 'working' ? 'statusWorking' : employee.employmentStatus === 'not_working' ? 'statusNotWorking' : 'statusOpenToWork')}` : ''}
                  </p>
                </div>
                <p className="ms-auto font-serif text-4xl tabular-nums">{formatScoreValue(employee.score)}<span className="text-lg text-muted-foreground"> / 5</span></p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{employee.credibleRatingCount} {t('basedOn')}</p>
            </DashboardSurface>
            <div className="grid gap-4 sm:grid-cols-3">
              <DashboardSurface title={t('startingScore')}>
                <p className="font-serif text-3xl tabular-nums">{formatScoreValue(reputation.startingScore)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {reputation.startingBasis === 'engine_baseline' ? t('engineBaselineNote') : reputation.joinedDuringPeriod ? t('joinedDuringPeriod') : t('recordedScore')}
                </p>
              </DashboardSurface>
              <DashboardSurface title={periodThroughToday ? t('currentScore') : t('scoreAtPeriodEnd')}>
                <p className="font-serif text-3xl tabular-nums">{formatScoreValue(reputation.endingScore)}</p>
              </DashboardSurface>
              <DashboardSurface title={t('reputationChange')}>
                <p className="font-serif text-3xl tabular-nums">{formatScoreChange(reputation.change)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{directionLabel(reputation.direction, t)}</p>
              </DashboardSurface>
            </div>
            <DashboardSurface title={t('reputationHistory')} description={t('historyChartHelp')}>
              <ReputationHistoryChart points={points} emptyLabel={t('noScoreHistory')} omittedLabel={t('omittedHistory')} />
            </DashboardSurface>
            <DashboardSurface title={t('ratingHistory')} description={t('ratingHistoryHelp')}>
              {ratings.length ? (
                <div className="grid gap-2">
                  {ratings.map((rating) => (
                    <RecordShell
                      key={rating.id}
                      title={`${rating.rater?.name || rating.attributionTitle || '—'} · ${rating.relationship.replaceAll('_', ' ')}`}
                      subtitle={[formatAdminDate(rating.createdAt), rating.channel, [rating.ratingCity, rating.ratingCountry].filter(Boolean).join(', ')].filter(Boolean).join(' · ')}
                      badges={<StatusBadge tone="muted">{formatScoreValue(rating.r)}</StatusBadge>}
                    >
                      <p className="text-xs text-muted-foreground">
                        {rating.categoryScores
                          ? Object.entries(rating.categoryScores).map(([key, value]) => `${key} ${Number(value).toFixed(1)}`).join(' · ')
                          : null}
                      </p>
                      {rating.comment ? <p className="mt-1 text-sm text-foreground">{rating.comment}</p> : null}
                    </RecordShell>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t('noRatingsInPeriod')}</p>
              )}
              {cursor ? (
                <button type="button" className="mt-4 text-sm font-semibold text-emerald-700" disabled={loadingMore} onClick={() => void loadMore()}>
                  {loadingMore ? t('loading') : t('loadMoreRatings')}
                </button>
              ) : null}
            </DashboardSurface>
          </>
        ) : null}
      </main>
    </ProductShell>
  )
}
