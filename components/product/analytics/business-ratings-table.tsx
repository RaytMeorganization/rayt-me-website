'use client'

import { StatusBadge } from '@/components/product/dashboard-ui'
import { formatAdminDate } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'
import type { BusinessRatingItem } from '@/lib/types'

function categorySummary(scores: unknown) {
  if (!scores || typeof scores !== 'object') return '—'
  return Object.entries(scores as Record<string, number>)
    .filter(([, value]) => typeof value === 'number')
    .map(([key, value]) => `${key.slice(0, 3)} ${value.toFixed(1)}`)
    .join(' · ')
}

export function BusinessRatingsTable({ items }: { items: BusinessRatingItem[] }) {
  const { t } = useI18n()
  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{t('noRatingsYet')}</p>
  }
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="py-2 pe-3">{t('ratingDate')}</th>
              <th className="py-2 pe-3">{t('ratingOverall')}</th>
              <th className="py-2 pe-3">{t('ratingEmployee')}</th>
              <th className="py-2 pe-3">{t('ratingRater')}</th>
              <th className="py-2 pe-3">{t('ratingRelationship')}</th>
              <th className="py-2 pe-3">{t('categoryBreakdown')}</th>
              <th className="py-2">{t('ratingComment')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map(row => {
              const fromLabel =
                row.direction === 'given' && row.rater?.name
                  ? row.rater.name
                  : row.attributionTitle || '—'
              return (
                <tr key={row.id} className="border-b border-white/5 align-top">
                  <td className="py-3 pe-3 text-muted-foreground">{formatAdminDate(row.createdAt)}</td>
                  <td className="py-3 pe-3">
                    <StatusBadge tone="muted">{Number(row.r ?? 0).toFixed(1)}</StatusBadge>
                  </td>
                  <td className="py-3 pe-3 text-foreground">{row.target?.name ?? '—'}</td>
                  <td className="py-3 pe-3 text-muted-foreground">{fromLabel}</td>
                  <td className="py-3 pe-3 text-muted-foreground">{row.relationship}</td>
                  <td className="py-3 pe-3 text-xs text-muted-foreground">{categorySummary(row.categoryScores)}</td>
                  <td className="py-3 text-muted-foreground">{row.comment || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 md:hidden">
        {items.map(row => {
          const fromLabel =
            row.direction === 'given' && row.rater?.name ? row.rater.name : row.attributionTitle || '—'
          return (
            <article key={row.id} className="rounded-xl border border-white/10 bg-muted/15 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{row.target?.name ?? '—'}</p>
                <StatusBadge tone="muted">{Number(row.r ?? 0).toFixed(1)}</StatusBadge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{formatAdminDate(row.createdAt)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t('ratingRater')}: {fromLabel}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{categorySummary(row.categoryScores)}</p>
              {row.comment ? <p className="mt-2 text-sm text-foreground">{row.comment}</p> : null}
            </article>
          )
        })}
      </div>
    </>
  )
}
