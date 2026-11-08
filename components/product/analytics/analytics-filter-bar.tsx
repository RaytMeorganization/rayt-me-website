'use client'

import { inputClass } from '@/components/product/shell'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/components/product/providers'
import type { AnalyticsPeriodPreset } from '@/lib/types'

export type EmployeeOption = { id: string; name: string }

export function AnalyticsFilterBar({
  period,
  from,
  to,
  employeeId,
  employees,
  onPeriod,
  onFrom,
  onTo,
  onEmployee,
  onReset,
}: {
  period: AnalyticsPeriodPreset
  from: string
  to: string
  employeeId: string
  employees: EmployeeOption[]
  onPeriod: (period: AnalyticsPeriodPreset) => void
  onFrom: (value: string) => void
  onTo: (value: string) => void
  onEmployee: (value: string) => void
  onReset: () => void
}) {
  const { t } = useI18n()
  const periods: AnalyticsPeriodPreset[] = ['current_month', 'previous_month', 'current_year', 'custom']
  const labels: Record<AnalyticsPeriodPreset, string> = {
    current_month: t('periodCurrentMonth'),
    previous_month: t('periodPreviousMonth'),
    current_year: t('periodCurrentYear'),
    custom: t('periodCustom'),
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-card/80 p-4 backdrop-blur-xl lg:flex-row lg:flex-wrap lg:items-end">
      <fieldset className="min-w-0 flex-1">
        <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t('reportingPeriod')}
        </legend>
        <div className="flex flex-wrap gap-2">
          {periods.map(value => (
            <button
              key={value}
              type="button"
              onClick={() => onPeriod(value)}
              aria-pressed={period === value}
              className={
                period === value
                  ? 'rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  : 'rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              }
            >
              {labels[value]}
            </button>
          ))}
        </div>
      </fieldset>
      {period === 'custom' ? (
        <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
          <label className="text-xs text-muted-foreground">
            {t('dateFrom')}
            <input type="date" className={`${inputClass} mt-1`} value={from} onChange={event => onFrom(event.target.value)} />
          </label>
          <label className="text-xs text-muted-foreground">
            {t('dateTo')}
            <input type="date" className={`${inputClass} mt-1`} value={to} onChange={event => onTo(event.target.value)} />
          </label>
        </div>
      ) : null}
      <label className="min-w-[12rem] text-xs text-muted-foreground">
        {t('filterEmployee')}
        <select className={`${inputClass} mt-1`} value={employeeId} onChange={event => onEmployee(event.target.value)}>
          <option value="">{t('filterAllEmployees')}</option>
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </label>
      <Button type="button" variant="outline" size="sm" onClick={onReset}>
        {t('resetFilters')}
      </Button>
    </div>
  )
}
