'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Award, ArrowDownToLine, ArrowUpFromLine, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react'
import { AnalyticsFilterBar } from '@/components/product/analytics/analytics-filter-bar'
import { DashboardKpiCard } from '@/components/product/analytics/dashboard-kpi-card'
import {
  CategoryBreakdownChart,
  PeriodComparisonChart,
  RatingVolumeChart,
  ReputationTrendChart,
} from '@/components/product/analytics/business-charts'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { AnalyticsPeriodPreset, BusinessAnalytics } from '@/lib/types'
import { ErrorBanner } from '@/components/product/dashboard-ui'

function parsePeriod(value: string | null): AnalyticsPeriodPreset {
  if (value === 'previous_month' || value === 'current_year' || value === 'custom') return value
  return 'current_month'
}

function formatScore(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toFixed(1)
}

export function BusinessOverviewAnalytics({
  employees,
}: {
  employees: { id: string; name: string }[]
}) {
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const period = parsePeriod(searchParams.get('period'))
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const employeeId = searchParams.get('employeeId') ?? ''
  const [data, setData] = useState<BusinessAnalytics | null>(null)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')

  const setParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(patch)) {
        if (!value) params.delete(key)
        else params.set(key, value)
      }
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  useEffect(() => {
    const controller = new AbortController()
    let stale = false
    const timer = window.setTimeout(() => {
      setBusy(true)
      setError('')
      const qs = new URLSearchParams()
      qs.set('period', period)
      if (period === 'custom' && from) qs.set('from', from)
      if (period === 'custom' && to) qs.set('to', to)
      if (employeeId) qs.set('employeeId', employeeId)
      void api<BusinessAnalytics>(`/business/analytics?${qs.toString()}`)
        .then(payload => {
          if (stale || controller.signal.aborted) return
          setData(payload)
        })
        .catch(cause => {
          if (stale || controller.signal.aborted) return
          setError(errorMessage(cause, t('analyticsLoadFailed')))
        })
        .finally(() => {
          if (!stale) setBusy(false)
        })
    }, 0)
    return () => {
      stale = true
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [employeeId, from, period, t, to])

  const periodLabel = useMemo(() => {
    if (period === 'previous_month') return t('periodPreviousMonth')
    if (period === 'current_year') return t('periodCurrentYear')
    if (period === 'custom') return t('periodCustom')
    return t('periodCurrentMonth')
  }, [period, t])

  return (
    <div className="grid gap-4">
      <AnalyticsFilterBar
        period={period}
        from={from}
        to={to}
        employeeId={employeeId}
        employees={employees}
        onPeriod={next => setParams({ period: next === 'current_month' ? null : next })}
        onFrom={value => setParams({ from: value || null, period: 'custom' })}
        onTo={value => setParams({ to: value || null, period: 'custom' })}
        onEmployee={value => setParams({ employeeId: value || null })}
        onReset={() => setParams({ period: null, from: null, to: null, employeeId: null })}
      />
      {error ? <ErrorBanner message={error} retryLabel={t('retry')} /> : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardKpiCard
          icon={Award}
          label={t('kpiTeamAverage')}
          value={formatScore(data?.snapshot.averageReputation)}
          suffix={t('outOfFive')}
          periodLabel={`${t('snapshotLabel')} · ${periodLabel}`}
          comparison={data?.comparison.reputationChange}
          higherIsBetter
          tooltip={t('kpiTeamAverageHelp')}
          hint={data?.comparison.reputationChange == null ? t('comparisonUnavailable') : t('kpiTeamAverageHelp')}
        />
        <DashboardKpiCard
          icon={ArrowDownToLine}
          label={t('kpiRatingsReceived')}
          value={String(data?.period.ratingsReceived ?? '—')}
          periodLabel={`${t('periodEventsLabel')} · ${periodLabel}`}
          comparison={data ? data.comparison.ratingsReceivedChange : null}
          higherIsBetter={null}
          tooltip={t('kpiRatingsReceivedHelp')}
        />
        <DashboardKpiCard
          icon={ArrowUpFromLine}
          label={t('kpiRatingsGiven')}
          value={String(data?.period.ratingsGiven ?? '—')}
          periodLabel={`${t('periodEventsLabel')} · ${periodLabel}`}
          comparison={data ? data.comparison.ratingsGivenChange : null}
          higherIsBetter={null}
          tooltip={t('kpiRatingsGivenHelp')}
        />
        <DashboardKpiCard
          icon={ShieldCheck}
          label={t('kpiVerifiedTeam')}
          value={String(data?.snapshot.verifiedMemberCount ?? '—')}
          hint={`${data?.snapshot.verifiedMemberCount ?? 0} / ${data?.snapshot.memberCount ?? 0}`}
          periodLabel={t('snapshotLabel')}
          tooltip={t('kpiVerifiedTeamHelp')}
        />
        <DashboardKpiCard
          icon={TrendingUp}
          label={t('kpiHighestReputation')}
          value={formatScore(data?.snapshot.highestReputation)}
          suffix={t('outOfFive')}
          periodLabel={t('snapshotLabel')}
          tooltip={t('kpiHighestReputation')}
        />
        <DashboardKpiCard
          icon={TrendingDown}
          label={t('kpiLowestReputation')}
          value={formatScore(data?.snapshot.lowestReputation)}
          suffix={t('outOfFive')}
          periodLabel={t('snapshotLabel')}
          tooltip={t('kpiLowestReputation')}
        />
      </div>
      <ReputationTrendChart data={data?.trend ?? []} loading={busy} />
      <div className="grid gap-4 lg:grid-cols-2">
        <PeriodComparisonChart
          loading={busy}
          currentLabel={t('currentPeriod')}
          previousLabel={t('previousPeriod')}
          rows={[
            {
              name: t('kpiTeamAverage'),
              current: data?.period.reputation ?? null,
              previous: data?.previousPeriod.reputation ?? null,
            },
          ]}
        />
        <PeriodComparisonChart
          loading={busy}
          currentLabel={t('currentPeriod')}
          previousLabel={t('previousPeriod')}
          rows={[
            {
              name: t('kpiRatingsReceived'),
              current: data?.period.ratingsReceived ?? 0,
              previous: data?.previousPeriod.ratingsReceived ?? 0,
            },
            {
              name: t('kpiRatingsGiven'),
              current: data?.period.ratingsGiven ?? 0,
              previous: data?.previousPeriod.ratingsGiven ?? 0,
            },
          ]}
        />
      </div>
      <RatingVolumeChart data={data?.volume ?? []} loading={busy} />
      <CategoryBreakdownChart data={data?.period.categoryAverages ?? []} loading={busy} />
    </div>
  )
}
