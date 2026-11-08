'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { EmployeeScoreHistoryChart } from '@/components/product/analytics/business-charts'
import { BusinessRatingsTable } from '@/components/product/analytics/business-ratings-table'
import { DashboardKpiCard } from '@/components/product/analytics/dashboard-kpi-card'
import { ErrorBanner, LoadingBlock } from '@/components/product/dashboard-ui'
import { PageHeader, ProductShell } from '@/components/product/shell'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { EmployeeReputationDetail, PaginatedBusinessRatings } from '@/lib/types'
import { Award, Minus, Plus } from 'lucide-react'

export function EmployeeReputationView({ employeeId }: { employeeId: string }) {
  const { t } = useI18n()
  const [detail, setDetail] = useState<EmployeeReputationDetail | null>(null)
  const [ratings, setRatings] = useState<PaginatedBusinessRatings>({ items: [], nextCursor: null })
  const [busy, setBusy] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const [nextDetail, page] = await Promise.all([
        api<EmployeeReputationDetail>(`/business/employees/${encodeURIComponent(employeeId)}/reputation`),
        api<PaginatedBusinessRatings>(`/business/employees/${encodeURIComponent(employeeId)}/ratings?limit=25`),
      ])
      setDetail(nextDetail)
      setRatings(page)
    } catch (cause) {
      setError(errorMessage(cause, t('analyticsLoadFailed')))
    } finally {
      setBusy(false)
    }
  }, [employeeId, t])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function loadMore() {
    if (!ratings.nextCursor) return
    setLoadingMore(true)
    try {
      const page = await api<PaginatedBusinessRatings>(
        `/business/employees/${encodeURIComponent(employeeId)}/ratings?limit=25&cursor=${encodeURIComponent(ratings.nextCursor)}`,
      )
      setRatings(current => ({
        items: [...current.items, ...page.items],
        nextCursor: page.nextCursor,
      }))
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
          eyebrow={t('employeeReputation')}
          title={detail?.employee.name || t('employeeReputation')}
          description={detail?.employee.jobTitle || t('businessDashboardTitle')}
          action={
            <Button nativeButton={false} variant="outline" size="sm" render={<Link href="/business-dashboard" />}>
              {t('backToDashboard')}
            </Button>
          }
        />
        {error ? (
          <div className="mt-5">
            <ErrorBanner message={error} onRetry={() => void load()} retryLabel={t('retry')} />
          </div>
        ) : null}
        {busy && !detail ? (
          <div className="mt-8">
            <LoadingBlock rows={4} />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardKpiCard
                icon={Minus}
                label={t('startingScore')}
                value={detail ? detail.startingScore.toFixed(1) : '—'}
                suffix={t('outOfFive')}
                tooltip={t('startingScore')}
              />
              <DashboardKpiCard
                icon={Award}
                label={t('currentScore')}
                value={detail ? detail.currentScore.toFixed(1) : '—'}
                suffix={t('outOfFive')}
                tooltip={t('currentScore')}
              />
              <DashboardKpiCard
                icon={Plus}
                label={t('scoreChange')}
                value={detail ? `${detail.change > 0 ? '+' : ''}${detail.change.toFixed(1)}` : '—'}
                comparison={detail?.change ?? null}
                higherIsBetter
                tooltip={t('scoreChange')}
              />
              <DashboardKpiCard
                icon={Award}
                label={t('basedOn')}
                value={String(detail?.credibleRatingCount ?? 0)}
                tooltip={t('basedOn')}
              />
            </div>
            <EmployeeScoreHistoryChart
              loading={busy}
              data={(detail?.history ?? []).map(point => ({ at: point.at, score: point.score }))}
            />
            <section className="rounded-2xl border border-white/10 bg-card/90 p-5">
              <h2 className="font-serif text-xl text-foreground">{t('ratingHistory')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('ratingsFeedHelp')}</p>
              <div className="mt-4">
                <BusinessRatingsTable items={ratings.items} />
              </div>
              {ratings.nextCursor ? (
                <Button className="mt-4" variant="outline" disabled={loadingMore} onClick={() => void loadMore()}>
                  {loadingMore ? t('loading') : t('loadMore')}
                </Button>
              ) : null}
            </section>
          </div>
        )}
      </main>
    </ProductShell>
  )
}
