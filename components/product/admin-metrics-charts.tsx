'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { dictionaries } from '@/lib/i18n'

type TKey = keyof typeof dictionaries.en

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function toRows(
  metrics: Record<string, number>,
  keys: string[],
  labels: Record<string, string>,
) {
  return keys
    .filter(key => metrics[key] != null)
    .map(key => ({
      key,
      name: labels[key] ?? key,
      value: Number(metrics[key]) || 0,
    }))
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload?: { name: string; value: number } }[] }) {
  if (!active || !payload?.length) return null
  const row = payload[0]?.payload
  if (!row) return null
  return (
    <div className="rounded-lg border border-white/10 bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur-xl">
      <p className="font-medium text-foreground">{row.name}</p>
      <p className="mt-0.5 font-mono tabular-nums text-muted-foreground">{row.value.toLocaleString()}</p>
    </div>
  )
}

function MetricBarChart({
  title,
  description,
  data,
  yDomain,
}: {
  title: string
  description?: string
  data: { name: string; value: number }[]
  yDomain?: [number, number]
}) {
  if (!data.length) return null
  return (
    <Card className="border-white/10 bg-muted/15 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="h-[280px] pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
              tickLine={false}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={52}
            />
            <YAxis
              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
              allowDecimals={Boolean(yDomain)}
              domain={yDomain ?? ['auto', 'auto']}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function AdminMetricsCharts({
  mode,
  metrics,
  t,
}: {
  mode: 'overview' | 'analytics'
  metrics: Record<string, number>
  t: (key: TKey) => string
}) {
  const overviewLabels: Record<string, string> = {
    users: t('users'),
    organizations: t('organizations'),
    ratings: t('ratings'),
    openDisputes: t('disputes'),
  }

  const analyticsLabels: Record<string, string> = {
    verifiedUsers: `${t('users')} · ${t('complete')}`,
    activeSubscriptions: `${t('plan')} · ${t('status')}`,
    activeProfiles: t('members'),
  }

  if (mode === 'overview') {
    const volume = toRows(metrics, ['users', 'organizations', 'ratings', 'openDisputes'], overviewLabels)
    return (
      <div className="mb-6 grid gap-4">
        <MetricBarChart title={t('overview')} description={t('adminIntro')} data={volume} />
      </div>
    )
  }

  const growth = toRows(metrics, ['verifiedUsers', 'activeSubscriptions', 'activeProfiles'], analyticsLabels)
  const reputation = metrics.averageReputation != null
    ? [{ name: t('reputation'), value: Number(metrics.averageReputation) }]
    : []

  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <MetricBarChart title={t('analytics')} description={t('adminIntro')} data={growth} />
      <MetricBarChart
        title={t('averageRating')}
        description={t('basedOn')}
        data={reputation}
        yDomain={[0, 5]}
      />
    </div>
  )
}
