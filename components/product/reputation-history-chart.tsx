'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatScoreValue, type HistoryPoint } from '@/lib/business-analytics'

export function ReputationHistoryChart({
  points,
  emptyLabel,
  omittedLabel,
}: {
  points: HistoryPoint[]
  emptyLabel: string
  omittedLabel: string
}) {
  const plotted = points.filter((point) => point.kind !== 'omitted' || point.score == null)
  const data = points.map((point) => ({
    at: point.at,
    label: new Date(point.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    score: point.score,
    moderated: point.moderated,
    kind: point.kind,
  }))
  const hasScore = data.some((point) => point.score != null)
  if (!hasScore) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }
  const omitted = plotted.some((point) => point.kind === 'omitted')

  return (
    <div className="space-y-3">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#87958d', fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[1, 5]} tick={{ fill: '#87958d', fontSize: 11 }} width={36} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const row = payload[0]?.payload as { label?: string; score?: number | null; kind?: string; moderated?: boolean }
                if (!row || row.score == null) return <div className="rounded-xl border border-white/10 bg-[#17201e] px-3 py-2 text-xs text-white">{omittedLabel}</div>
                return (
                  <div className="rounded-xl border border-white/10 bg-[#17201e] px-3 py-2 text-xs text-white">
                    <p>{row.label}</p>
                    <p className="mt-1 font-semibold tabular-nums">{formatScoreValue(row.score)} / 5</p>
                    {row.kind === 'omitted' ? <p className="mt-1 text-white/70">{omittedLabel}</p> : null}
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#059669"
              strokeWidth={2}
              connectNulls={false}
              dot={{ r: 3, fill: '#059669' }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {omitted ? <p className="text-xs text-muted-foreground">{omittedLabel}</p> : null}
    </div>
  )
}
