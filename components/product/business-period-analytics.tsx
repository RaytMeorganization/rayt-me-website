'use client'

import { useEffect, useMemo, useState } from 'react'
import { DashboardSurface, ErrorBanner, LoadingBlock } from '@/components/product/dashboard-ui'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import {
  formatScoreChange,
  formatScoreValue,
  type AnalyticsPeriod,
  type PeriodAnalytics,
} from '@/lib/business-analytics'
import { inputClass } from '@/components/product/shell'

const PERIODS: AnalyticsPeriod[] = ['current_month', 'previous_month', 'current_year', 'custom']

export function BusinessPeriodAnalytics({
  employees,
}: {
  employees: { id: string; name: string }[]
}) {
  const { t } = useI18n()
  const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', [])
  const [period, setPeriod] = useState<AnalyticsPeriod>('current_month')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [data, setData] = useState<PeriodAnalytics | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (period === 'custom' && (!from || !to)) {
      const timer = window.setTimeout(() => {
        setLoading(false)
        setData(null)
      }, 0)
      return () => window.clearTimeout(timer)
    }
    const params = new URLSearchParams({ period, timeZone })
    if (employeeId) params.set('employeeId', employeeId)
    if (period === 'custom') {
      params.set('from', from)
      params.set('to', to)
    }
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError('')
      void api<PeriodAnalytics>(`/business/analytics?${params.toString()}`, { signal: controller.signal })
        .then((next) => {
          setData(next)
          setLoading(false)
        })
        .catch((cause: unknown) => {
          if (controller.signal.aborted) return
          setError(errorMessage(cause, t('error')))
          setData(null)
          setLoading(false)
        })
    }, 0)
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [employeeId, from, period, t, timeZone, to])

  const periodLabel = (value: AnalyticsPeriod) =>
    value === 'current_month'
      ? t('periodCurrentMonth')
      : value === 'previous_month'
        ? t('periodPreviousMonth')
        : value === 'current_year'
          ? t('periodCurrentYear')
          : t('periodCustom')

  return (
    <DashboardSurface title={t('analysisPeriod')} description={t('engineBaselineNote')}>
      <div className="flex flex-wrap gap-3">
        <label className="grid gap-1 text-xs text-muted-foreground">
          {t('analysisPeriod')}
          <select className={inputClass} value={period} onChange={(event) => setPeriod(event.target.value as AnalyticsPeriod)}>
            {PERIODS.map((value) => (
              <option key={value} value={value}>{periodLabel(value)}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          {t('filterEmployee')}
          <select className={inputClass} value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
            <option value="">{t('entireTeam')}</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </label>
        {period === 'custom' ? (
          <>
            <label className="grid gap-1 text-xs text-muted-foreground">
              {t('periodStart')}
              <input className={inputClass} type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
            </label>
            <label className="grid gap-1 text-xs text-muted-foreground">
              {t('periodEndDate')}
              <input className={inputClass} type="date" value={to} onChange={(event) => setTo(event.target.value)} />
            </label>
          </>
        ) : null}
      </div>
      {error ? <div className="mt-4"><ErrorBanner message={error} retryLabel={t('retry')} onRetry={() => setPeriod((current) => current)} /></div> : null}
      {loading ? <LoadingBlock rows={2} /> : null}
      {!loading && data ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{t('currentPeriodAverage')}</p>
            <p className="mt-1 font-serif text-3xl tabular-nums">{formatScoreValue(data.current.averageReputation)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{data.current.fromDate} – {data.current.toDate}</p>
            <p className="text-xs text-muted-foreground">{data.current.ratingCount} {t('ratingsReceived')}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{t('previousPeriod')}</p>
            <p className="mt-1 font-serif text-3xl tabular-nums">
              {data.comparable ? formatScoreValue(data.previous?.averageReputation) : '—'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.comparable && data.previous ? `${data.previous.fromDate} – ${data.previous.toDate}` : t('comparisonUnavailable')}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{t('reputationChange')}</p>
            <p className="mt-1 font-serif text-3xl tabular-nums">{data.comparable ? formatScoreChange(data.change) : '—'}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.direction === 'positive' ? t('scoreUp') : data.direction === 'negative' ? t('scoreDown') : data.direction === 'unchanged' ? t('scoreUnchanged') : t('comparisonUnavailable')}
            </p>
          </div>
        </div>
      ) : null}
    </DashboardSurface>
  )
}
