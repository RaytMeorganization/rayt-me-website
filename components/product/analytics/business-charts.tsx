'use client'

import type { ReactNode } from 'react'
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useI18n } from '@/components/product/providers'
import { cn } from '@/lib/utils'

const GOLD = '#AD8547'
const SAGE = '#2E6B4C'
const NAVY = '#9CA8C2'

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-xl">
      {label ? <p className="font-medium text-foreground">{label}</p> : null}
      {payload.map(item => (
        <p key={item.name} className="mt-0.5 font-mono tabular-nums text-muted-foreground">
          {item.name}: {typeof item.value === 'number' ? item.value : '—'}
        </p>
      ))}
    </div>
  )
}

export function ChartLoadingState({ className }: { className?: string }) {
  return <div aria-busy="true" className={cn('h-[280px] animate-pulse rounded-xl bg-muted/40', className)} />
}

export function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="grid h-[280px] place-items-center rounded-xl border border-dashed border-white/10 bg-muted/10 px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}

function ChartTable({
  caption,
  columns,
  rows,
}: {
  caption: string
  columns: string[]
  rows: Array<Array<string | number>>
}) {
  const { t } = useI18n()
  if (!rows.length) return null
  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-xs text-muted-foreground">{t('chartTableAlternative')}</summary>
      <table className="mt-2 w-full text-left text-xs">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-white/10 text-muted-foreground">
            {columns.map(column => (
              <th key={column} className="py-1 pe-3 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-white/5">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-1 pe-3 tabular-nums text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  )
}

function ChartShell({
  title,
  description,
  loading,
  empty,
  children,
  table,
}: {
  title: string
  description: string
  loading?: boolean
  empty?: boolean
  children: ReactNode
  table?: ReactNode
}) {
  const { t } = useI18n()
  return (
    <Card className="border-white/10 bg-card/90 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.85)]">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? <ChartLoadingState /> : empty ? <ChartEmptyState message={t('noChartData')} /> : children}
        {table}
      </CardContent>
    </Card>
  )
}

export function ReputationTrendChart({
  data,
  loading,
}: {
  data: { at: string; score: number }[]
  loading?: boolean
}) {
  const { t } = useI18n()
  const rows = data.map(point => ({
    label: point.at.slice(0, 10),
    score: Number(point.score.toFixed(2)),
  }))
  return (
    <ChartShell
      title={t('reputationTrend')}
      description={t('reputationTrendHelp')}
      loading={loading}
      empty={!rows.length}
      table={<ChartTable caption={t('reputationTrend')} columns={[t('ratingDate'), t('score')]} rows={rows.map(row => [row.label, row.score])} />}
    >
      <div className="h-[300px] min-h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Area dataKey="score" type="linear" stroke="none" fill={GOLD} fillOpacity={0.12} isAnimationActive={false} />
            <Line
              type="linear"
              dataKey="score"
              name={t('score')}
              stroke={GOLD}
              strokeWidth={2}
              dot={{ r: 3, fill: GOLD }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

export function EmployeeScoreHistoryChart({
  data,
  loading,
}: {
  data: { at: string; score: number }[]
  loading?: boolean
}) {
  return <ReputationTrendChart data={data} loading={loading} />
}

export function PeriodComparisonChart({
  currentLabel,
  previousLabel,
  rows,
  loading,
}: {
  currentLabel: string
  previousLabel: string
  rows: { name: string; current: number | null; previous: number | null }[]
  loading?: boolean
}) {
  const { t } = useI18n()
  const chartRows = rows.filter(row => row.current != null || row.previous != null)
  return (
    <ChartShell
      title={t('periodComparison')}
      description={t('periodComparisonHelp')}
      loading={loading}
      empty={!chartRows.length}
      table={
        <ChartTable
          caption={t('periodComparison')}
          columns={[t('overview'), currentLabel, previousLabel]}
          rows={chartRows.map(row => [row.name, row.current ?? '—', row.previous ?? '—'])}
        />
      }
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartRows} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="current" name={currentLabel} fill={GOLD} radius={[6, 6, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="previous" name={previousLabel} fill={NAVY} radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

export function RatingVolumeChart({
  data,
  loading,
}: {
  data: { bucket: string; received: number; given: number }[]
  loading?: boolean
}) {
  const { t } = useI18n()
  return (
    <ChartShell
      title={t('ratingsVolume')}
      description={t('ratingsVolumeHelp')}
      loading={loading}
      empty={!data.length}
      table={
        <ChartTable
          caption={t('ratingsVolume')}
          columns={[t('ratingDate'), t('ratingsReceived'), t('ratingsGiven')]}
          rows={data.map(row => [row.bucket, row.received, row.given])}
        />
      }
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="bucket" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="received" name={t('ratingsReceived')} fill={GOLD} radius={[6, 6, 0, 0]} isAnimationActive={false} />
            <Bar dataKey="given" name={t('ratingsGiven')} fill={SAGE} radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

export function CategoryBreakdownChart({
  data,
  loading,
}: {
  data: { key: string; average: number | null; sampleSize: number }[]
  loading?: boolean
}) {
  const { t } = useI18n()
  const labels: Record<string, string> = {
    professionalism: t('cat_professionalism'),
    communication: t('cat_communication'),
    reliability: t('cat_reliability'),
    knowledge: t('cat_knowledge'),
    collaboration: t('cat_collaboration'),
  }
  const rows = data
    .filter(row => row.average != null)
    .map(row => ({ name: labels[row.key] ?? row.key, average: row.average as number }))
  return (
    <ChartShell
      title={t('categoryBreakdown')}
      description={t('categoryBreakdownHelp')}
      loading={loading}
      empty={!rows.length}
      table={
        <ChartTable
          caption={t('categoryBreakdown')}
          columns={[t('overview'), t('averageRating')]}
          rows={rows.map(row => [row.name, row.average])}
        />
      }
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickLine={false} />
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="average" name={t('averageRating')} fill={SAGE} radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}
