'use client'

import Link from 'next/link'
import { ArrowRightIcon, CheckIcon, MinusIcon, PlusIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth, useI18n } from '@/components/product/providers'
import { usePublicPlanCatalog } from '@/hooks/use-public-plan-catalog'
import {
  centsToUsd,
  formatMarketingUsd as formatUsd,
  resolvePlanPrices,
  type BillingInterval,
} from '@/lib/plan-pricing'
import {
  PLAN_PICKER_ID,
  rememberPlanSelection,
  settingsCheckoutPath,
  type FunnelPlanCode,
} from '@/lib/get-started-funnel'
import { storeUrlForUserAgent } from '@/lib/store-links'
import { cn } from '@/lib/utils'

const ctaPrimary =
  'bg-violet-600 text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.8)] hover:bg-violet-500'
const planCard =
  'h-full cursor-pointer rounded-3xl border border-white/[0.08] bg-slate-900/70 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] ring-0 backdrop-blur-xl transition'

export function GetStartedPlansPanel({
  selected,
  interval,
  employees,
  tied,
  onSelect,
  onInterval,
  onEmployees,
  onConfirmed,
}: {
  selected: FunnelPlanCode
  interval: BillingInterval
  employees: number
  tied: boolean
  onSelect: (plan: FunnelPlanCode) => void
  onInterval: (interval: BillingInterval) => void
  onEmployees: (employees: number) => void
  onConfirmed?: (selection: {
    plan: FunnelPlanCode
    interval: BillingInterval
    employees: number
  }) => void
}) {
  const { t } = useI18n()
  const { user } = useAuth()
  const { plans: catalogPlans } = usePublicPlanCatalog()

  const proPrices = resolvePlanPrices(
    'pro',
    catalogPlans.find(row => row.code === 'pro'),
  )
  const businessPrices = resolvePlanPrices(
    'business',
    catalogPlans.find(row => row.code === 'business'),
  )
  const proUnit =
    interval === 'month' ? centsToUsd(proPrices.monthlyCents) : centsToUsd(proPrices.yearlyCents)
  const businessUnit =
    interval === 'month'
      ? centsToUsd(businessPrices.monthlyCents)
      : centsToUsd(businessPrices.yearlyCents)
  const businessTotal = businessUnit * employees
  const period = interval === 'month' ? t('getStartedPerMonth') : t('getStartedPerYear')
  const help =
    tied && selected
      ? t('getStartedTiedHelp').replace('{plan}', selected.toUpperCase())
      : user
        ? t('getStartedAlreadySignedIn')
        : t('getStartedChoosePlanHelp')

  function continueWithPlan() {
    rememberPlanSelection({ plan: selected, interval, employees, tied: Boolean(onConfirmed) || tied })
    if (onConfirmed) {
      onConfirmed({ plan: selected, interval, employees })
      return
    }
    if (!user) {
      document.getElementById('get-started-account')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (selected === 'basic') {
      window.location.href = storeUrlForUserAgent(navigator.userAgent)
      return
    }
    window.location.assign(settingsCheckoutPath({ plan: selected, interval, employees, autoCheckout: true }))
  }

  const plans: {
    id: FunnelPlanCode
    name: string
    price: string
    detail: string
    blurb: string
    features: string[]
    recommended?: boolean
  }[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: formatUsd(0),
      detail: t('getStartedFreeForever'),
      blurb: t('getStartedBasicBlurb'),
      features: ['Unlimited ratings received', 'Public virtual card', 'Core themes'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: formatUsd(proUnit),
      detail: period,
      recommended: true,
      blurb: t('getStartedProBlurb'),
      features: ['Unlimited ratings received', 'More monthly ratings given', 'Custom theme'],
    },
    {
      id: 'business',
      name: 'Business',
      price: formatUsd(businessTotal),
      detail: `${period}${employees > 1 ? ` · ${t('getStartedSeats').replace('{count}', String(employees))}` : ''}`,
      blurb: '',
      features: ['Team admin controls', 'Company-branded theme', 'Per-employee pricing'],
    },
  ]

  return (
    <div id={PLAN_PICKER_ID} className="scroll-mt-28 space-y-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/80">
          {t('getStartedStep2')}
        </p>
        <h1 className="mt-3 font-brand text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {t('getStartedChoosePlan')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/65">{help}</p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
          {(['month', 'year'] as const).map(value => (
            <button
              key={value}
              type="button"
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition',
                interval === value ? 'bg-violet-600 text-white' : 'text-white/70 hover:text-white',
              )}
              onClick={() => onInterval(value)}
            >
              {value === 'month' ? t('billingMonthly') : t('billingYearly')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {plans.map(plan => (
          <Card
            key={plan.id}
            role="button"
            tabIndex={0}
            className={cn(
              planCard,
              selected === plan.id &&
                'border-violet-500/40 shadow-[0_0_50px_-12px_rgba(139,92,246,0.4)] ring-1 ring-violet-500/30',
            )}
            onClick={() => onSelect(plan.id)}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onSelect(plan.id)
              }
            }}
          >
            <CardHeader>
              <div className="flex h-6 items-center">
                {plan.recommended ? (
                  <Badge className="bg-violet-500 text-white">{t('getStartedRecommended')}</Badge>
                ) : (
                  <span className="h-6" />
                )}
              </div>
              <CardDescription className="font-medium tracking-[0.22em] text-white/55">
                {plan.name.toUpperCase()}
              </CardDescription>
              <CardTitle className="flex min-h-[4.75rem] flex-col gap-1 font-brand text-4xl font-medium tracking-tight text-white">
                <span>{plan.price}</span>
                <span className="text-base font-normal text-muted-foreground">{plan.detail}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <div className="min-h-[7.25rem]">
                {plan.id === 'business' ? (
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="gs-employees">{t('getStartedEmployees')}</FieldLabel>
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                          aria-label="Decrease employees"
                          onClick={event => {
                            event.stopPropagation()
                            onEmployees(Math.max(1, employees - 1))
                          }}
                        >
                          <MinusIcon />
                        </Button>
                        <Input
                          id="gs-employees"
                          type="number"
                          min={1}
                          max={10000}
                          value={employees}
                          onClick={event => event.stopPropagation()}
                          onChange={event => onEmployees(Number(event.target.value) || 1)}
                          className="rounded-xl text-center font-brand text-lg tabular-nums"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                          aria-label="Increase employees"
                          onClick={event => {
                            event.stopPropagation()
                            onEmployees(Math.min(10000, employees + 1))
                          }}
                        >
                          <PlusIcon />
                        </Button>
                      </div>
                      <FieldDescription>
                        {formatUsd(businessTotal)} {period}
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                ) : (
                  <p className="text-sm leading-6 text-muted-foreground">{plan.blurb}</p>
                )}
              </div>
              <ul className="flex flex-1 flex-col gap-3 text-sm text-muted-foreground">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                type="button"
                variant={selected === plan.id ? 'default' : 'outline'}
                className={cn('min-h-11 w-full', selected === plan.id && ctaPrimary)}
                onClick={event => {
                  event.stopPropagation()
                  onSelect(plan.id)
                }}
              >
                {selected === plan.id ? t('getStartedSelected') : t('getStartedSelect')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-3 pt-2">
        {!user && !tied ? (
          <p className="text-center text-sm text-white/55">{t('getStartedCreateFirst')}</p>
        ) : null}
        <Button type="button" className={cn('min-h-11 w-full', ctaPrimary)} onClick={continueWithPlan}>
          {tied
            ? t('getStartedKeepPlan')
            : t('getStartedContinuePlan').replace('{plan}', selected.toUpperCase())}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Link href="/" className={cn(buttonVariants({ variant: 'ghost' }), 'text-white/60')}>
          {t('getStartedBackHome')}
        </Link>
      </div>
    </div>
  )
}
