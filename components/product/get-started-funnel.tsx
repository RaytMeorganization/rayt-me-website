'use client'

import { useEffect, useState } from 'react'
import { GetStartedAccountForm } from '@/components/product/get-started-account-form'
import { GetStartedPlansPanel } from '@/components/product/get-started-plans-panel'
import { useAuth, useI18n } from '@/components/product/providers'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  capturePlanFromSearchParams,
  funnelFromSearch,
  planSummaryLabel,
  readRememberedPlan,
  scrollToPlanPicker,
  settingsCheckoutPath,
  syncGetStartedUrl,
  type FunnelPlanCode,
} from '@/lib/get-started-funnel'
import type { BillingInterval } from '@/lib/plan-pricing'
import { storeUrlForUserAgent } from '@/lib/store-links'

function goToTiedCheckout() {
  const remembered = readRememberedPlan()
  const plan = remembered.plan
  if (!plan || plan === 'basic') {
    if (plan === 'basic') {
      window.location.href = storeUrlForUserAgent(navigator.userAgent)
      return true
    }
    return false
  }
  window.location.assign(
    settingsCheckoutPath({
      plan,
      interval: remembered.interval,
      employees: remembered.employees,
      autoCheckout: true,
    }),
  )
  return true
}

function remember(plan: FunnelPlanCode, interval: BillingInterval, employees: number) {
  capturePlanFromSearchParams(
    new URLSearchParams({
      plan,
      interval,
      ...(employees > 1 ? { employees: String(employees) } : {}),
    }),
  )
}

export function GetStartedFunnel({
  initialPlan,
  initialInterval,
  initialEmployees,
  initialEditing,
}: {
  initialPlan: FunnelPlanCode | null
  initialInterval: BillingInterval
  initialEmployees: number
  initialEditing: boolean
}) {
  const { t } = useI18n()
  const { user, loading } = useAuth()
  const [plan, setPlan] = useState<FunnelPlanCode>(initialPlan ?? 'pro')
  const [interval, setInterval] = useState<BillingInterval>(initialInterval)
  const [employees, setEmployees] = useState(initialEmployees)
  const [editing, setEditing] = useState(initialEditing)
  const [tied, setTied] = useState(Boolean(initialPlan))

  function writeUrl(next: {
    plan: FunnelPlanCode
    interval: BillingInterval
    employees: number
    editing: boolean
    tied: boolean
  }) {
    syncGetStartedUrl({
      plan: next.tied ? next.plan : null,
      interval: next.interval,
      employees: next.employees,
      edit: next.editing,
    })
    if (next.tied) remember(next.plan, next.interval, next.employees)
  }

  useEffect(() => {
    if (initialPlan) remember(initialPlan, initialInterval, initialEmployees)
  }, [initialPlan, initialInterval, initialEmployees])

  useEffect(() => {
    if (loading || !user || editing || !tied) return
    const timer = window.setTimeout(() => goToTiedCheckout(), 0)
    return () => window.clearTimeout(timer)
  }, [loading, user, editing, tied, plan, interval, employees])

  useEffect(() => {
    if (!editing) return
    const timer = window.setTimeout(() => scrollToPlanPicker(), 80)
    return () => window.clearTimeout(timer)
  }, [editing])

  useEffect(() => {
    function onPopState() {
      const next = funnelFromSearch(new URLSearchParams(window.location.search))
      setPlan(next.plan ?? 'pro')
      setInterval(next.interval)
      setEmployees(next.employees)
      setEditing(next.editing)
      setTied(Boolean(next.plan))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function openPlanEditor() {
    setEditing(true)
    writeUrl({ plan, interval, employees, editing: true, tied })
    window.setTimeout(() => scrollToPlanPicker(), 80)
  }

  function applyPlan(selection: {
    plan: FunnelPlanCode
    interval: BillingInterval
    employees: number
  }) {
    setPlan(selection.plan)
    setInterval(selection.interval)
    setEmployees(selection.employees)
    setTied(true)
    setEditing(false)
    writeUrl({
      plan: selection.plan,
      interval: selection.interval,
      employees: selection.employees,
      editing: false,
      tied: true,
    })
    if (user) {
      window.setTimeout(() => goToTiedCheckout(), 0)
      return
    }
    window.setTimeout(() => {
      document.getElementById('get-started-account')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 50)
  }

  if (user && tied && !editing) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-center text-sm text-white/70">
        {t('getStartedCheckoutRedirect')}
      </div>
    )
  }

  const showPlans = !tied || editing
  const selectedSummary = tied
    ? planSummaryLabel({ plan, interval, employees })
    : undefined

  return (
    <div className="px-5 py-10 sm:py-14">
      {!user && !editing ? (
        <div id="get-started-account" className="mx-auto max-w-lg scroll-mt-28">
          <GetStartedAccountForm
            onCreated={() => {
              if (readRememberedPlan().tied && goToTiedCheckout()) return
              setEditing(true)
              writeUrl({ plan, interval, employees, editing: true, tied })
              scrollToPlanPicker()
            }}
            tied={tied}
            selectedSummary={selectedSummary}
            onEditPlan={openPlanEditor}
          />
        </div>
      ) : null}
      {user && !editing ? (
        <p className="mx-auto mb-10 max-w-lg text-center text-sm text-white/60">
          {t('getStartedAlreadySignedIn')}
        </p>
      ) : null}
      {editing && selectedSummary ? (
        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-slate-900/70 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200/80">
              {t('getStartedSelectedPlan')}
            </p>
            <p className="mt-1 text-sm font-medium text-white">{selectedSummary}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="min-h-10"
            onClick={() => {
              setEditing(false)
              writeUrl({ plan, interval, employees, editing: false, tied })
            }}
          >
            {t('getStartedBackToAccount')}
          </Button>
        </div>
      ) : null}
      {showPlans ? (
        <div className={cn('mx-auto max-w-6xl', !editing && !user && 'mt-16')}>
          <GetStartedPlansPanel
            selected={plan}
            interval={interval}
            employees={employees}
            tied={tied}
            onSelect={next => {
              setPlan(next)
              writeUrl({ plan: next, interval, employees, editing, tied })
            }}
            onInterval={next => {
              setInterval(next)
              writeUrl({ plan, interval: next, employees, editing, tied })
            }}
            onEmployees={next => {
              setEmployees(next)
              writeUrl({ plan, interval, employees: next, editing, tied })
            }}
            onConfirmed={applyPlan}
          />
        </div>
      ) : null}
    </div>
  )
}
