import { dictionaries } from '@/lib/i18n'
import type { useI18n } from '@/components/product/providers'

type Translate = ReturnType<typeof useI18n>['t']
type DictKey = Parameters<Translate>[0]

const PLAN_LABELS: Record<string, string> = { basic: 'Basic', pro: 'Pro', business: 'Business' }

function lookup(t: Translate, key: string, fallback: string) {
  return key in dictionaries.en ? t(key as DictKey) : fallback
}

export function planLabel(plan: string | null | undefined) {
  if (!plan) return '—'
  return PLAN_LABELS[plan.toLowerCase()] ?? plan
}

/** Organization subscription status (TRIALING, ACTIVE, PAST_DUE, CANCELED). */
export function subscriptionStatusLabel(t: Translate, status: string | null | undefined) {
  if (!status) return '—'
  return lookup(t, `subStatus${status}`, status)
}

export function subscriptionStatusTone(status: string | null | undefined): 'ok' | 'warn' | 'muted' | 'danger' {
  if (status === 'ACTIVE' || status === 'TRIALING') return 'ok'
  if (status === 'PAST_DUE') return 'warn'
  return 'muted'
}

/** Billing invoice status (paid, pending, failed, refunded). */
export function paymentStatusLabel(t: Translate, status: string | null | undefined) {
  if (!status) return '—'
  return lookup(t, `payStatus_${status.toLowerCase()}`, status)
}

export function paymentStatusTone(status: string | null | undefined): 'ok' | 'warn' | 'muted' | 'danger' {
  const s = String(status ?? '').toLowerCase()
  return s === 'paid' ? 'ok' : s === 'pending' ? 'warn' : s === 'failed' ? 'danger' : 'muted'
}

export function inviteStatusLabel(t: Translate, status: string | null | undefined) {
  if (!status) return '—'
  return lookup(t, `inviteStatus_${status.toUpperCase()}`, status)
}

export const SUBSCRIPTION_STATUSES = ['ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED'] as const
