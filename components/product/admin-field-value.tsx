'use client'

import { Badge } from '@/components/ui/badge'
import { CopyableText, formatAdminDate, formatPriceCents, InteractiveLink } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'

const SKIP_KEYS = new Set(['entitlements', 'subscription', '_count', 'passwordHash', 'target', 'rater', 'actor'])

export function shouldSkipAdminField(key: string) {
  return SKIP_KEYS.has(key) || key.startsWith('_')
}

export function AdminFieldValue({ fieldKey, value }: { fieldKey: string; value: unknown }) {
  const { t } = useI18n()
  if (value == null) return <>—</>
  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? 'secondary' : 'outline'} className="rounded-full">
        {value ? t('activate') : t('deactivate')}
      </Badge>
    )
  }
  if (fieldKey === 'priceCents') return <span className="font-mono tabular-nums">{formatPriceCents(value)}</span>
  if (fieldKey.endsWith('At') || fieldKey.includes('Date')) return <span>{formatAdminDate(value)}</span>
  if (fieldKey === 'id' || fieldKey.endsWith('Id')) return <CopyableText value={String(value)} />
  if (fieldKey === 'email' || fieldKey.toLowerCase().includes('email')) {
    const email = String(value)
    return <InteractiveLink href={`mailto:${email}`}>{email}</InteractiveLink>
  }
  if (fieldKey === 'phone') {
    const phone = String(value)
    return <InteractiveLink href={`tel:${phone}`}>{phone}</InteractiveLink>
  }
  if (fieldKey === 'website' || fieldKey === 'logoUrl') {
    const raw = String(value)
    const href = raw.startsWith('http') ? raw : `https://${raw}`
    return <InteractiveLink href={href} external>{raw}</InteractiveLink>
  }
  if (typeof value === 'object') return <CopyableText value={JSON.stringify(value)} mono />
  return <span className="break-words">{String(value)}</span>
}
