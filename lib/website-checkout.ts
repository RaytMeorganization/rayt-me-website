import { api, ApiError } from '@/lib/api'
import type { BillingInterval } from '@/lib/plan-pricing'

export async function startWebsiteCheckout(input: {
  planCode: 'pro' | 'business'
  interval: BillingInterval
  employeeSeats?: number
}) {
  const origin = window.location.origin
  return api<{ checkoutUrl: string; sessionId: string }>('/billing/checkout', {
    method: 'POST',
    body: JSON.stringify({
      planCode: input.planCode,
      interval: input.interval,
      employeeSeats: input.employeeSeats,
      successUrl: `${origin}/settings?tab=plan&paid=1`,
      cancelUrl: `${origin}/settings?tab=plan&canceled=1&plan=${input.planCode}&interval=${input.interval}`,
    }),
  })
}

/** Maps a checkout failure to a localized message key (backend errors are English-only). */
export function checkoutErrorKey(
  cause: unknown,
): 'billingCheckoutPending' | 'checkoutInvalid' | 'checkoutFailed' | 'alreadySubscribed' {
  if (cause instanceof ApiError) {
    if (cause.status === 409) return 'alreadySubscribed'
    if (cause.status === 503) return 'billingCheckoutPending'
    if (cause.status === 400) return 'checkoutInvalid'
  }
  return 'checkoutFailed'
}

/** Opens the Stripe Billing Portal (same tab) and returns to the current page. */
export async function openBillingPortal() {
  const result = await api<{ url: string }>('/billing/portal', {
    method: 'POST',
    body: JSON.stringify({ returnUrl: window.location.href }),
  })
  window.location.assign(result.url)
}

export function portalErrorKey(cause: unknown): 'billingNoAccount' | 'billingCheckoutPending' | 'billingOpenFailed' {
  if (cause instanceof ApiError) {
    if (cause.status === 404) return 'billingNoAccount'
    if (cause.status === 503) return 'billingCheckoutPending'
  }
  return 'billingOpenFailed'
}

export function updateBusinessSeats(seats: number) {
  return api<{ seats: number }>('/business/billing/seats', { method: 'POST', body: JSON.stringify({ seats }) })
}

export function seatsErrorKey(cause: unknown): 'seatsInvalid' | 'seatsUpdateFailed' | 'billingNoAccount' {
  if (cause instanceof ApiError) {
    if (cause.status === 400) return 'seatsInvalid'
    if (cause.status === 404) return 'billingNoAccount'
  }
  return 'seatsUpdateFailed'
}
