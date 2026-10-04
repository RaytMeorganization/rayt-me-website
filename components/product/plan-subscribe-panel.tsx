'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { YearlyBillingOfferDialog } from '@/components/product/yearly-billing-offer-dialog'
import { useI18n } from '@/components/product/providers'
import { usePublicPlanCatalog } from '@/hooks/use-public-plan-catalog'
import { errorMessage } from '@/lib/api'
import {
  centsToUsd,
  formatMarketingUsd,
  resolvePlanPrices,
  USD_PER_EMPLOYEE_YEARLY_SAVINGS,
  USD_PRO_YEARLY_SAVINGS,
  type BillingInterval,
} from '@/lib/plan-pricing'
import { startWebsiteCheckout } from '@/lib/website-checkout'

type PaidPlan = 'pro' | 'business'

export function PlanSubscribePanel({
  defaultPlan = 'pro',
  defaultInterval = 'month',
  employeeSeats = 1,
  currentTier = 'basic',
  autoStart = false,
}: {
  defaultPlan?: PaidPlan
  defaultInterval?: BillingInterval
  employeeSeats?: number
  currentTier?: 'basic' | 'pro' | 'business'
  autoStart?: boolean
}) {
  const { t } = useI18n()
  const { plans } = usePublicPlanCatalog()
  const [planCode, setPlanCode] = useState<PaidPlan>(defaultPlan)
  const [interval, setInterval] = useState<BillingInterval>(defaultInterval)
  const [offerOpen, setOfferOpen] = useState(false)
  const [checkoutNote, setCheckoutNote] = useState('')
  const [busy, setBusy] = useState(false)

  const catalog = plans.find(row => row.code === planCode)
  const { yearlyCents, monthlyCents } = resolvePlanPrices(planCode, catalog)
  const seats = Math.max(1, employeeSeats)

  function displayAmount(cents: number) {
    const total = planCode === 'business' ? cents * seats : cents
    return formatMarketingUsd(centsToUsd(total))
  }

  function startSubscribe() {
    if (interval === 'month') {
      setOfferOpen(true)
      return
    }
    void confirmCheckout('year')
  }

  async function confirmCheckout(chosen: BillingInterval) {
    setOfferOpen(false)
    setInterval(chosen)
    setBusy(true)
    setCheckoutNote('')
    try {
      const result = await startWebsiteCheckout({
        planCode,
        interval: chosen,
        employeeSeats: seats,
      })
      window.location.assign(result.checkoutUrl)
    } catch (cause) {
      const cents = chosen === 'year' ? yearlyCents : monthlyCents
      const amount = displayAmount(cents)
      setCheckoutNote(
        `${planCode.toUpperCase()} · ${chosen === 'year' ? t('billingYearly') : t('billingMonthly')} · ${amount}${
          planCode === 'business' && seats > 1 ? ` (${seats} ${t('employees')})` : ''
        }. ${errorMessage(cause, t('billingCheckoutPending'))}`,
      )
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    if (!autoStart) return
    const timer = window.setTimeout(() => {
      if (defaultInterval === 'month') setOfferOpen(true)
      else void confirmCheckout('year')
    }, 0)
    return () => window.clearTimeout(timer)
    // Start once for the inbound checkout query.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auto-start from settings query
  }, [autoStart])

  const savings =
    planCode === 'pro'
      ? USD_PRO_YEARLY_SAVINGS
      : USD_PER_EMPLOYEE_YEARLY_SAVINGS * seats
  const isUpgrade = currentTier !== planCode
  const actionLabel = isUpgrade ? t('getStartedUpgrade') : t('subscribe')

  return (
    <div className="grid gap-4">
      {currentTier !== 'basic' ? (
        <p className="text-sm text-muted-foreground">
          {t('getStartedCurrentPlan').replace('{plan}', currentTier.toUpperCase())}
        </p>
      ) : null}
      <ToggleGroup
        variant="outline"
        spacing={2}
        value={[planCode]}
        onValueChange={next => {
          const selected = Array.isArray(next) ? next[0] : next
          if (selected === 'pro' || selected === 'business') setPlanCode(selected)
        }}
        className="grid w-full grid-cols-2"
      >
        <ToggleGroupItem value="pro" className="min-h-11">Pro</ToggleGroupItem>
        <ToggleGroupItem value="business" className="min-h-11">Business</ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup
        variant="outline"
        spacing={2}
        value={[interval]}
        onValueChange={next => {
          const selected = Array.isArray(next) ? next[0] : next
          if (selected === 'month' || selected === 'year') setInterval(selected)
        }}
        className="grid w-full grid-cols-2"
      >
        <ToggleGroupItem value="month" className="min-h-11">
          {t('billingMonthly')} · {displayAmount(monthlyCents)}
        </ToggleGroupItem>
        <ToggleGroupItem value="year" className="min-h-11">
          {t('billingYearly')} · {displayAmount(yearlyCents)}
        </ToggleGroupItem>
      </ToggleGroup>

      <p className="text-sm text-muted-foreground">
        {t('billingYearlySaveHint').replace('{amount}', formatMarketingUsd(savings))}
      </p>

      <Button type="button" className="min-h-11 w-full" disabled={busy} onClick={startSubscribe}>
        {busy ? t('loading') : actionLabel}
      </Button>

      {checkoutNote ? (
        <p className="rounded-lg border border-white/10 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          {checkoutNote}
        </p>
      ) : null}

      <YearlyBillingOfferDialog
        open={offerOpen}
        planCode={planCode}
        employees={seats}
        onOpenChange={setOfferOpen}
        onChoose={chosen => void confirmCheckout(chosen)}
      />
    </div>
  )
}
