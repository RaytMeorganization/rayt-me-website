import type { BillingInterval } from '@/lib/plan-pricing'

export type FunnelPlanCode = 'basic' | 'pro' | 'business'

const PLAN_KEY = 'rayt-get-started-plan'
const INTERVAL_KEY = 'rayt-get-started-interval'
const EMPLOYEES_KEY = 'rayt-get-started-employees'

export function rememberPlanSelection(input: {
  plan: FunnelPlanCode
  interval?: BillingInterval
  employees?: number
}) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(PLAN_KEY, input.plan)
  if (input.interval) window.sessionStorage.setItem(INTERVAL_KEY, input.interval)
  if (input.employees != null && input.employees > 0) {
    window.sessionStorage.setItem(EMPLOYEES_KEY, String(input.employees))
  }
}

export function readRememberedPlan(): {
  plan: FunnelPlanCode
  interval: BillingInterval
  employees: number
} {
  if (typeof window === 'undefined') {
    return { plan: 'pro', interval: 'year', employees: 1 }
  }
  const plan = window.sessionStorage.getItem(PLAN_KEY)
  const interval = window.sessionStorage.getItem(INTERVAL_KEY)
  const employees = Number(window.sessionStorage.getItem(EMPLOYEES_KEY) || '1')
  const safePlan: FunnelPlanCode =
    plan === 'basic' || plan === 'pro' || plan === 'business' ? plan : 'pro'
  const safeInterval: BillingInterval = interval === 'month' ? 'month' : 'year'
  return {
    plan: safePlan,
    interval: safeInterval,
    employees: Number.isFinite(employees) && employees >= 1 ? employees : 1,
  }
}

export function capturePlanFromSearchParams(params: URLSearchParams) {
  const plan = params.get('plan')
  const interval = params.get('interval')
  const employees = params.get('employees')
  if (plan !== 'basic' && plan !== 'pro' && plan !== 'business') return
  rememberPlanSelection({
    plan,
    interval: interval === 'month' ? 'month' : interval === 'year' ? 'year' : undefined,
    employees: employees ? Number(employees) : undefined,
  })
}

export function getStartedPath(input?: {
  plan?: FunnelPlanCode
  interval?: BillingInterval
  employees?: number
}) {
  const params = new URLSearchParams()
  if (input?.plan) params.set('plan', input.plan)
  if (input?.interval) params.set('interval', input.interval)
  if (input?.employees != null && input.employees > 1) {
    params.set('employees', String(input.employees))
  }
  const query = params.toString()
  return query ? `/get-started?${query}` : '/get-started'
}

export const GET_STARTED_PLANS_PATH = '/get-started/plans'
