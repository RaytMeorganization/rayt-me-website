'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { inputClass } from '@/components/product/shell'
import { CopyableText, formatAdminDate, InteractiveLink } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'
import { MARKETING_PLANS } from '@/lib/plan-pricing'

export function AdminOrganizationCard({
  org,
  busy,
  onSave,
  onAssignPlan,
}: {
  org: Record<string, unknown>
  busy?: boolean
  onSave: (data: {
    name: string
    website: string | null
    description: string | null
    brandColor: string | null
  }) => void
  onAssignPlan: (planCode: string) => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(String(org.name || ''))
  const [website, setWebsite] = useState(String(org.website || ''))
  const [description, setDescription] = useState(String(org.description || ''))
  const [brandColor, setBrandColor] = useState(String(org.brandColor || '#11213D'))

  const subscription = org.subscription as { status?: string; plan?: { code?: string; name?: string } } | undefined
  const [planCode, setPlanCode] = useState(String(subscription?.plan?.code || 'business'))

  const memberCount = (org._count as { memberships?: number } | undefined)?.memberships
  const planLabel = subscription?.plan?.name || subscription?.plan?.code
  const websiteUrl = website.trim()
  const href = websiteUrl && !websiteUrl.startsWith('http') ? `https://${websiteUrl}` : websiteUrl

  return (
    <Card className="overflow-hidden border-white/10 bg-card/90 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="h-[3px] bg-[#2E6B4C]" />
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">{String(org.name || t('organizations'))}</h3>
          <div className="flex flex-wrap gap-2">
            {memberCount != null ? (
              <Badge variant="secondary" className="rounded-full">{memberCount} {t('members')}</Badge>
            ) : null}
            {planLabel ? (
              <Badge variant="outline" className="rounded-full">{planLabel}</Badge>
            ) : null}
            {subscription?.status ? (
              <Badge variant="secondary" className="rounded-full">{subscription.status}</Badge>
            ) : null}
          </div>
        </div>
        <CopyableText value={String(org.slug || org.id || '')} />
        {href ? (
          <InteractiveLink href={href} external>{websiteUrl}</InteractiveLink>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        <p className="text-xs text-muted-foreground">{formatAdminDate(org.updatedAt || org.createdAt)}</p>
      </CardContent>
      <Separator className="bg-white/10" />
      <CardFooter className="flex flex-col gap-3 border-0 bg-muted/15 px-5 py-4">
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-xs">{t('name')}</FieldLabel>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-input/30" />
          </Field>
          <Field>
            <FieldLabel className="text-xs">{t('website')}</FieldLabel>
            <Input value={website} onChange={e => setWebsite(e.target.value)} type="url" className="bg-input/30" />
          </Field>
          <Field className="sm:col-span-2">
            <FieldLabel className="text-xs">{t('description')}</FieldLabel>
            <Input value={description} onChange={e => setDescription(e.target.value)} className="bg-input/30" />
          </Field>
          <Field>
            <FieldLabel className="text-xs">{t('brandColor')}</FieldLabel>
            <Input
              type="color"
              aria-label={t('brandColor')}
              className="h-11 w-full cursor-pointer bg-input/30 p-1"
              value={brandColor}
              onChange={e => setBrandColor(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel className="text-xs">{t('plan')}</FieldLabel>
            <select
              className={inputClass}
              value={planCode}
              disabled={busy}
              onChange={e => setPlanCode(e.target.value)}
            >
              {MARKETING_PLANS.map(plan => (
                <option key={plan.code} value={plan.code}>{plan.name}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={busy || !name.trim()}
            onClick={() => onSave({
              name: name.trim(),
              website: website.trim() ? website.trim() : null,
              description: description.trim() ? description.trim() : null,
              brandColor: /^#[0-9A-Fa-f]{6}$/.test(brandColor) ? brandColor : null,
            })}
          >
            {t('save')}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={busy || !planCode}
            onClick={() => onAssignPlan(planCode)}
          >
            {t('assignPlan')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
