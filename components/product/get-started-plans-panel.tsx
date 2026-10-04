'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightIcon, CheckIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { usePublicPlanCatalog } from '@/hooks/use-public-plan-catalog'
import {
  centsToUsd,
  formatMarketingUsd as formatUsd,
  resolvePlanPrices,
} from '@/lib/plan-pricing'
import {
  readRememberedPlan,
  rememberPlanSelection,
  type FunnelPlanCode,
} from '@/lib/get-started-funnel'
import { SETTINGS_PLAN_PATH } from '@/lib/signup-handoff'
import { storeUrlForUserAgent } from '@/lib/store-links'
import { cn } from '@/lib/utils'

const ctaPrimary =
  'bg-violet-600 text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.8)] hover:bg-violet-500'

export function GetStartedPlansPanel() {
  const router = useRouter()
  const { plans: catalogPlans } = usePublicPlanCatalog()
  const remembered = useMemo(() => readRememberedPlan(), [])
  const [selected, setSelected] = useState<FunnelPlanCode>(remembered.plan)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const reveal = window.setTimeout(() => setRevealed(true), 120)
    const scroll = window.setTimeout(() => {
      document.getElementById('plan-picker')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 280)
    return () => {
      window.clearTimeout(reveal)
      window.clearTimeout(scroll)
    }
  }, [])

  const { interval, employees } = remembered
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
  const period = interval === 'month' ? '/ month' : '/ year'

  function continueWithPlan() {
    rememberPlanSelection({ plan: selected, interval, employees })
    if (selected === 'basic') {
      window.location.href = storeUrlForUserAgent(navigator.userAgent)
      return
    }
    router.push(`${SETTINGS_PLAN_PATH}&plan=${selected}&interval=${interval}`)
  }

  const plans: {
    id: FunnelPlanCode
    name: string
    price: string
    detail: string
    features: string[]
    recommended?: boolean
  }[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: formatUsd(0),
      detail: 'Free forever',
      features: ['Unlimited ratings received', 'Public virtual card', 'Core themes'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: formatUsd(proUnit),
      detail: period,
      recommended: true,
      features: ['Unlimited ratings received', 'More monthly ratings given', 'Custom theme'],
    },
    {
      id: 'business',
      name: 'Business',
      price: formatUsd(businessTotal),
      detail: `${period}${employees > 1 ? ` · ${employees} seats` : ''}`,
      features: ['Team admin controls', 'Company-branded theme', 'Per-employee pricing'],
    },
  ]

  return (
    <div
      className={cn(
        'space-y-10 transition-all duration-700 ease-out',
        revealed ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      )}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/80">Step 2</p>
        <h1 className="mt-3 font-brand text-3xl font-semibold text-white sm:text-4xl">Choose your plan</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">
          {remembered.plan !== 'pro'
            ? `You selected ${remembered.plan.toUpperCase()} from pricing — confirm below or change anytime.`
            : 'Pick the membership that fits how you share your card.'}
        </p>
      </div>

      <div id="plan-picker" className="scroll-mt-28 grid gap-4 lg:grid-cols-3">
        {plans.map(plan => (
          <Card
            key={plan.id}
            className={cn(
              'cursor-pointer border-white/10 bg-slate-900/50 backdrop-blur-xl transition',
              selected === plan.id && 'border-violet-500/40 ring-1 ring-violet-500/30',
            )}
            onClick={() => setSelected(plan.id)}
          >
            <CardHeader>
              <div className="flex h-6 items-center">
                {plan.recommended ? (
                  <Badge className="bg-violet-500 text-white">Recommended</Badge>
                ) : (
                  <span className="h-6" />
                )}
              </div>
              <CardDescription className="tracking-[0.18em]">{plan.name.toUpperCase()}</CardDescription>
              <CardTitle className="font-brand text-3xl text-white">
                {plan.price}
                <span className="mt-1 block text-sm font-normal text-muted-foreground">{plan.detail}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map(feature => (
                  <li key={feature} className="flex gap-2">
                    <CheckIcon className="mt-0.5 size-4 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                variant={selected === plan.id ? 'default' : 'outline'}
                className={cn('min-h-11 w-full', selected === plan.id && ctaPrimary)}
                onClick={e => {
                  e.stopPropagation()
                  setSelected(plan.id)
                }}
              >
                {selected === plan.id ? 'Selected' : 'Select'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-3">
        <Button type="button" className={cn('min-h-11 w-full', ctaPrimary)} onClick={continueWithPlan}>
          Continue with {selected.toUpperCase()}
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <button
          type="button"
          className={cn(buttonVariants({ variant: 'ghost' }), 'text-white/60')}
          onClick={() => router.push('/')}
        >
          Back to home
        </button>
      </div>
    </div>
  )
}
