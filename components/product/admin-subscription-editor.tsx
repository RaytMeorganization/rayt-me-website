'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { inputClass } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'
import { SUBSCRIPTION_STATUSES, planLabel, subscriptionStatusLabel } from '@/components/product/status-labels'
import { MARKETING_PLANS } from '@/lib/plan-pricing'
import { BUSINESS_MAX_SEATS, BUSINESS_MIN_SEATS } from '@/lib/business-seats'

export type SubscriptionChange = { planCode?: string; status?: string; seatQuantity?: number }

/** Plan, status and Business seat editor for one organization subscription. */
export function AdminSubscriptionEditor({
  idPrefix,
  planCode: initialPlan,
  status: initialStatus,
  seatQuantity: initialSeats,
  busy,
  onSave,
}: {
  idPrefix: string
  planCode: string
  status: string
  seatQuantity: number | null
  busy?: boolean
  onSave: (data: SubscriptionChange) => void
}) {
  const { t } = useI18n()
  const [planCode, setPlanCode] = useState(initialPlan)
  const [status, setStatus] = useState(initialStatus)
  const [seats, setSeats] = useState(initialSeats != null ? String(initialSeats) : '')
  const seatNumber = Number(seats)
  const seatsValid =
    seats.trim() === '' || (Number.isInteger(seatNumber) && seatNumber >= BUSINESS_MIN_SEATS && seatNumber <= BUSINESS_MAX_SEATS)
  const isBusiness = planCode === 'business'
  const dirty =
    planCode !== initialPlan ||
    status !== initialStatus ||
    (isBusiness && seats.trim() !== '' && seatNumber !== initialSeats)

  function save() {
    if (!seatsValid) return
    onSave({
      planCode,
      status,
      ...(isBusiness && seats.trim() !== '' ? { seatQuantity: seatNumber } : {}),
    })
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-plan`} className="text-xs">{t('plan')}</FieldLabel>
          <select id={`${idPrefix}-plan`} className={inputClass} value={planCode} disabled={busy} onChange={e => setPlanCode(e.target.value)}>
            {MARKETING_PLANS.map(plan => (
              <option key={plan.code} value={plan.code}>{planLabel(plan.code)}</option>
            ))}
          </select>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-status`} className="text-xs">{t('status')}</FieldLabel>
          <select id={`${idPrefix}-status`} className={inputClass} value={status} disabled={busy} onChange={e => setStatus(e.target.value)}>
            {SUBSCRIPTION_STATUSES.map(value => (
              <option key={value} value={value}>{subscriptionStatusLabel(t, value)}</option>
            ))}
          </select>
        </Field>
        {isBusiness ? (
          <Field data-invalid={!seatsValid || undefined}>
            <FieldLabel htmlFor={`${idPrefix}-seats`} className="text-xs">{t('seatQuantity')}</FieldLabel>
            <Input
              id={`${idPrefix}-seats`}
              type="number"
              inputMode="numeric"
              min={BUSINESS_MIN_SEATS}
              max={BUSINESS_MAX_SEATS}
              step={1}
              value={seats}
              disabled={busy}
              aria-invalid={!seatsValid || undefined}
              aria-describedby={`${idPrefix}-seats-help`}
              onChange={e => setSeats(e.target.value)}
              className="bg-input/30"
            />
            {seatsValid ? (
              <FieldDescription id={`${idPrefix}-seats-help`} className="text-xs">{t('seatQuantityHelp')}</FieldDescription>
            ) : (
              <FieldError id={`${idPrefix}-seats-help`} className="text-xs">{t('seatQuantityInvalid')}</FieldError>
            )}
          </Field>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" disabled={busy || !dirty || !seatsValid} onClick={save}>
          {busy ? t('saving') : t('save')}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          disabled={busy || initialStatus === 'CANCELED'}
          onClick={() => {
            if (!window.confirm(t('confirmCancelSubscription'))) return
            setStatus('CANCELED')
            onSave({ status: 'CANCELED' })
          }}
        >
          {t('adminCancelSubscription')}
        </Button>
      </div>
    </div>
  )
}
