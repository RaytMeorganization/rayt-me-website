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
export function checkoutErrorKey(cause: unknown): 'billingCheckoutPending' | 'checkoutInvalid' | 'checkoutFailed' {
  if (cause instanceof ApiError) {
    if (cause.status === 503) return 'billingCheckoutPending'
    if (cause.status === 400) return 'checkoutInvalid'
  }
  return 'checkoutFailed'
}
