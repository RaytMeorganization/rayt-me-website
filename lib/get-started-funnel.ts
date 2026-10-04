import type { BillingInterval } from '@/lib/plan-pricing'

export type FunnelPlanCode = 'basic' | 'pro' | 'business'

const PLAN_KEY = 'rayt-get-started-plan'
const INTERVAL_KEY = 'rayt-get-started-interval'
const EMPLOYEES_KEY = 'rayt-get-started-employees'
const TIED_KEY = 'rayt-get-started-tied'

export const PLAN_PICKER_ID = 'plan-picker'
export const GET_STARTED_PLANS_PATH = '/get-started#plan-picker'

export function parseFunnelPlan(value: string | null | undefined): FunnelPlanCode | null {
  return value === 'basic' || value === 'pro' || value === 'business' ? value : null
}

export function rememberPlanSelection(input: {
  plan: FunnelPlanCode
  interval?: BillingInterval
  employees?: number
  /** True when the visitor chose Subscribe / Go Pro on landing pricing. */
  tied?: boolean
}) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(PLAN_KEY, input.plan)
  if (input.interval) window.sessionStorage.setItem(INTERVAL_KEY, input.interval)
  if (input.employees != null && input.employees > 0) {
    window.sessionStorage.setItem(EMPLOYEES_KEY, String(input.employees))
  }
  if (input.tied === true) window.sessionStorage.setItem(TIED_KEY, '1')
  if (input.tied === false) window.sessionStorage.removeItem(TIED_KEY)
}

export function hasTiedPlan() {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(TIED_KEY) === '1'
}

export function clearTiedPlan() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(TIED_KEY)
}

export function readRememberedPlan(): {
  plan: FunnelPlanCode | null
  interval: BillingInterval
  employees: number
  tied: boolean
} {
  if (typeof window === 'undefined') {
    return { plan: null, interval: 'year', employees: 1, tied: false }
  }
  const plan = parseFunnelPlan(window.sessionStorage.getItem(PLAN_KEY))
  const interval = window.sessionStorage.getItem(INTERVAL_KEY)
  const employees = Number(window.sessionStorage.getItem(EMPLOYEES_KEY) || '1')
  return {
    plan,
    interval: interval === 'month' ? 'month' : 'year',
    employees: Number.isFinite(employees) && employees >= 1 ? employees : 1,
    tied: window.sessionStorage.getItem(TIED_KEY) === '1',
  }
}

export function capturePlanFromSearchParams(params: URLSearchParams) {
  const plan = parseFunnelPlan(params.get('plan'))
  const interval = params.get('interval')
  const employees = params.get('employees')
  if (!plan) {
    if (typeof window === 'undefined') return
    window.sessionStorage.removeItem(TIED_KEY)
    window.sessionStorage.removeItem(PLAN_KEY)
    return
  }
  rememberPlanSelection({
    plan,
    interval: interval === 'month' ? 'month' : interval === 'year' ? 'year' : undefined,
    employees: employees ? Number(employees) : undefined,
    tied: true,
  })
}

function firstSearchValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export function funnelFromSearch(
  search: URLSearchParams | Record<string, string | string[] | undefined>,
) {
  const get = (key: string) =>
    search instanceof URLSearchParams ? search.get(key) : firstSearchValue(search[key])
  const employees = Number(get('employees') || '1')
  return {
    plan: parseFunnelPlan(get('plan')),
    interval: (get('interval') === 'month' ? 'month' : 'year') as BillingInterval,
    employees: Number.isFinite(employees) && employees >= 1 ? employees : 1,
    editing: get('edit') === '1',
  }
}

export function getStartedPath(input?: {
  plan?: FunnelPlanCode | null
  interval?: BillingInterval
  employees?: number
  edit?: boolean
}) {
  const params = new URLSearchParams()
  if (input?.plan) params.set('plan', input.plan)
  if (input?.interval) params.set('interval', input.interval)
  if (input?.employees != null && input.employees > 1) {
    params.set('employees', String(input.employees))
  }
  if (input?.edit) params.set('edit', '1')
  const query = params.toString()
  return query ? `/get-started?${query}` : '/get-started'
}

/** Same-page query update without an RSC navigation (Next.js App Router SPA pattern). */
export function syncGetStartedUrl(input: {
  plan?: FunnelPlanCode | null
  interval?: BillingInterval
  employees?: number
  edit?: boolean
}) {
  if (typeof window === 'undefined') return
  const href = getStartedPath(input)
  const current = `${window.location.pathname}${window.location.search}`
  if (current === href) return
  window.history.pushState(null, '', href)
}

export function settingsCheckoutPath(input: {
  plan: Exclude<FunnelPlanCode, 'basic'>
  interval: BillingInterval
  employees?: number
  autoCheckout?: boolean
}) {
  const params = new URLSearchParams({
    tab: 'plan',
    plan: input.plan,
    interval: input.interval,
  })
  if (input.employees != null && input.employees > 1) {
    params.set('employees', String(input.employees))
  }
  if (input.autoCheckout) params.set('checkout', '1')
  return `/settings?${params}`
}

export function planSummaryLabel(input: {
  plan: FunnelPlanCode
  interval: BillingInterval
  employees: number
}) {
  const period = input.interval === 'month' ? 'monthly' : 'yearly'
  const seats = input.plan === 'business' && input.employees > 1 ? ` · ${input.employees}` : ''
  return `${input.plan.toUpperCase()} · ${period}${seats}`
}

export function scrollToPlanPicker() {
  if (typeof window === 'undefined') return
  window.requestAnimationFrame(() => {
    document.getElementById(PLAN_PICKER_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
