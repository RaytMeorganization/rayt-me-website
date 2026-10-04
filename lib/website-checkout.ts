import { api } from '@/lib/api'
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
      cancelUrl: `${origin}/settings?tab=plan&plan=${input.planCode}&interval=${input.interval}`,
    }),
  })
}
