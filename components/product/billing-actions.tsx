'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { inputClass } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'
import { BUSINESS_MIN_SEATS } from '@/lib/business-seats'
import { openBillingPortal, portalErrorKey, seatsErrorKey, updateBusinessSeats } from '@/lib/website-checkout'

/** Opens the Stripe Billing Portal (card, invoices, cancel). Web only; never shown in the app. */
export function ManageBillingButton({ variant = 'outline' }: { variant?: 'outline' | 'default' }) {
  const { t } = useI18n()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <div className="grid gap-2">
      <Button
        type="button"
        variant={variant}
        disabled={busy}
        onClick={() => {
          setBusy(true)
          setError('')
          openBillingPortal().catch(cause => {
            setError(t(portalErrorKey(cause)))
            setBusy(false)
          })
        }}
      >
        {busy ? t('openingBilling') : t('manageBilling')}
      </Button>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

/** Business seat quantity: at least 3 and never below seats in use (enforced again by the API). */
export function BusinessSeatsForm({ purchased, used, onUpdated }: { purchased: number | null; used: number; onUpdated: () => void }) {
  const { t } = useI18n()
  const minimum = Math.max(BUSINESS_MIN_SEATS, used)
  const [seats, setSeats] = useState(String(Math.max(purchased ?? minimum, minimum)))
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ text: string; error: boolean } | null>(null)
  const value = Number(seats)
  const valid = Number.isInteger(value) && value >= minimum && value <= 10000
  return (
    <form
      className="mt-4 flex flex-wrap items-end gap-3"
      onSubmit={event => {
        event.preventDefault()
        if (!valid) {
          setNote({ text: t('seatsInvalid'), error: true })
          return
        }
        setBusy(true)
        setNote(null)
        updateBusinessSeats(value)
          .then(() => {
            setNote({ text: t('seatsUpdated'), error: false })
            onUpdated()
          })
          .catch(cause => setNote({ text: t(seatsErrorKey(cause)), error: true }))
          .finally(() => setBusy(false))
      }}
    >
      <label className="grid gap-1 text-sm">
        <span className="text-muted-foreground">{t('seatsPurchased')}</span>
        <input
          className={`${inputClass} w-28`}
          type="number"
          inputMode="numeric"
          min={minimum}
          max={10000}
          value={seats}
          onChange={event => setSeats(event.target.value)}
        />
      </label>
      <Button type="submit" disabled={busy || !valid || value === purchased}>
        {busy ? t('saving') : t('updateSeats')}
      </Button>
      {note ? (
        <p role={note.error ? 'alert' : 'status'} className={`w-full text-sm ${note.error ? 'text-destructive' : 'text-emerald-200'}`}>
          {note.text}
        </p>
      ) : null}
    </form>
  )
}
