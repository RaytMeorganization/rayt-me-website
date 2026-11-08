'use client'

import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function DashboardKpiCard({
  icon: Icon,
  label,
  value,
  suffix,
  hint,
  comparison,
  higherIsBetter,
  tooltip,
  periodLabel,
}: {
  icon: LucideIcon
  label: string
  value: string
  suffix?: string
  hint?: string
  comparison?: number | null
  higherIsBetter?: boolean | null
  tooltip: string
  periodLabel?: string
}) {
  const tone =
    comparison == null || higherIsBetter == null
      ? 'neutral'
      : comparison === 0
        ? 'neutral'
        : (comparison > 0) === higherIsBetter
          ? 'up'
          : 'down'
  const comparisonText =
    comparison == null
      ? null
      : `${comparison > 0 ? '+' : ''}${Number.isInteger(comparison) ? comparison : comparison.toFixed(2)}`

  return (
    <Card
      className="border-white/10 bg-card/90 shadow-[0_18px_50px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl"
      title={tooltip}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
          <span className="grid size-8 place-items-center rounded-full border border-white/10 bg-white/5 text-[#AD8547]">
            <Icon className="size-4" aria-hidden />
          </span>
        </div>
        <p className="mt-3 flex items-baseline gap-1 font-serif text-3xl font-semibold tabular-nums tracking-tight text-foreground">
          <span>{value}</span>
          {suffix ? <span className="text-sm font-sans font-medium text-muted-foreground">{suffix}</span> : null}
        </p>
        {periodLabel ? <p className="mt-1 text-xs text-muted-foreground">{periodLabel}</p> : null}
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        {comparisonText ? (
          <p
            className={cn(
              'mt-2 text-xs font-medium tabular-nums',
              tone === 'up' && 'text-emerald-400',
              tone === 'down' && 'text-red-400',
              tone === 'neutral' && 'text-muted-foreground',
            )}
          >
            {comparisonText}
          </p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">{tooltip}</p>
        )}
      </CardContent>
    </Card>
  )
}
