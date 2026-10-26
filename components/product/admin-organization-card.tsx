'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/product/dashboard-ui'
import { CopyableText, formatAdminDate, InteractiveLink } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'
import { AdminSubscriptionEditor, type SubscriptionChange } from '@/components/product/admin-subscription-editor'
import { planLabel, subscriptionStatusLabel, subscriptionStatusTone } from '@/components/product/status-labels'
import { cn } from '@/lib/utils'

export function AdminOrganizationCard({
  org,
  busy,
  onSave,
  onSubscriptionChange,
}: {
  org: Record<string, unknown>
  busy?: boolean
  onSave: (data: {
    name: string
    website: string | null
    description: string | null
    brandColor: string | null
  }) => void
  onSubscriptionChange: (data: SubscriptionChange) => void
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(String(org.name || ''))
  const [website, setWebsite] = useState(String(org.website || ''))
  const [description, setDescription] = useState(String(org.description || ''))
  const [brandColor, setBrandColor] = useState(String(org.brandColor || '#11213D'))

  const subscription = org.subscription as
    | { status?: string; seatQuantity?: number | null; plan?: { code?: string; name?: string } }
    | undefined
  const memberCount = (org._count as { memberships?: number } | undefined)?.memberships
  const websiteUrl = String(org.website || '').trim()
  const href = websiteUrl && !websiteUrl.startsWith('http') ? `https://${websiteUrl}` : websiteUrl
  const id = String(org.id)
  const panelId = `org-${id}-details`

  return (
    <Card className="overflow-hidden border-white/10 bg-card/90 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="h-[3px]" style={{ backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(brandColor) ? brandColor : '#2E6B4C' }} />
      <CardContent className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">{String(org.name || t('organizations'))}</h3>
            {subscription?.status ? (
              <StatusBadge tone={subscriptionStatusTone(subscription.status)}>{subscriptionStatusLabel(t, subscription.status)}</StatusBadge>
            ) : null}
            {subscription?.plan?.code ? (
              <Badge variant="outline" className="rounded-full">{planLabel(subscription.plan.code)}</Badge>
            ) : null}
            {memberCount != null ? (
              <Badge variant="secondary" className="rounded-full">{memberCount} {t('members')}</Badge>
            ) : null}
            {subscription?.seatQuantity != null ? (
              <Badge variant="secondary" className="rounded-full">{t('seatQuantity')}: {subscription.seatQuantity}</Badge>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <CopyableText value={String(org.slug || org.id || '')} />
            {href ? <InteractiveLink href={href} external>{websiteUrl}</InteractiveLink> : null}
            <span className="text-xs text-muted-foreground">{formatAdminDate(org.updatedAt || org.createdAt)}</span>
          </div>
          {org.description ? <p className="max-w-3xl text-sm text-muted-foreground">{String(org.description)}</p> : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(value => !value)}
          className="justify-self-start md:justify-self-end"
        >
          {open ? t('hideDetails') : t('editDetails')}
          <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} aria-hidden />
        </Button>
      </CardContent>
      {open ? (
        <div id={panelId} className="border-t border-white/10 bg-muted/15 px-5 py-5">
          <form
            className="grid gap-4"
            onSubmit={event => {
              event.preventDefault()
              onSave({
                name: name.trim(),
                website: website.trim() ? website.trim() : null,
                description: description.trim() ? description.trim() : null,
                brandColor: /^#[0-9A-Fa-f]{6}$/.test(brandColor) ? brandColor : null,
              })
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_8rem]">
              <Field>
                <FieldLabel htmlFor={`${panelId}-name`} className="text-xs">{t('name')}</FieldLabel>
                <Input id={`${panelId}-name`} required value={name} onChange={e => setName(e.target.value)} className="bg-input/30" />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${panelId}-website`} className="text-xs">{t('website')}</FieldLabel>
                <Input id={`${panelId}-website`} value={website} onChange={e => setWebsite(e.target.value)} type="url" placeholder="https://" className="bg-input/30" />
              </Field>
              <Field>
                <FieldLabel htmlFor={`${panelId}-color`} className="text-xs">{t('brandColor')}</FieldLabel>
                <Input id={`${panelId}-color`} type="color" className="h-11 w-full cursor-pointer bg-input/30 p-1" value={brandColor} onChange={e => setBrandColor(e.target.value)} />
              </Field>
              <Field className="sm:col-span-2 lg:col-span-3">
                <FieldLabel htmlFor={`${panelId}-description`} className="text-xs">{t('description')}</FieldLabel>
                <Input id={`${panelId}-description`} value={description} onChange={e => setDescription(e.target.value)} className="bg-input/30" />
              </Field>
            </div>
            <div>
              <Button type="submit" size="sm" disabled={busy || !name.trim()}>{busy ? t('saving') : t('save')}</Button>
            </div>
          </form>
          <Separator className="my-5 bg-white/10" />
          <h4 className="mb-3 text-sm font-semibold text-foreground">{t('subscriptionEditor')}</h4>
          <AdminSubscriptionEditor
            idPrefix={`${panelId}-sub`}
            planCode={String(subscription?.plan?.code || 'business')}
            status={String(subscription?.status || 'ACTIVE')}
            seatQuantity={subscription?.seatQuantity ?? null}
            busy={busy}
            onSave={onSubscriptionChange}
          />
        </div>
      ) : null}
    </Card>
  )
}
