'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CopyableText, formatAdminDate, InteractiveLink } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'

export function AdminOrganizationCard({
  org,
  busy,
  onSave,
}: {
  org: Record<string, unknown>
  busy?: boolean
  onSave: (data: { name: string; website: string | null }) => void
}) {
  const { t } = useI18n()
  const [name, setName] = useState(String(org.name || ''))
  const [website, setWebsite] = useState(String(org.website || ''))

  const memberCount = (org._count as { memberships?: number } | undefined)?.memberships
  const websiteUrl = website.trim()
  const href = websiteUrl && !websiteUrl.startsWith('http') ? `https://${websiteUrl}` : websiteUrl

  return (
    <Card className="overflow-hidden border-white/10 bg-card/90 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="h-[3px] bg-[#2E6B4C]" />
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">{String(org.name || t('organizations'))}</h3>
          {memberCount != null ? (
            <Badge variant="secondary" className="rounded-full">{memberCount} {t('members')}</Badge>
          ) : null}
        </div>
        <CopyableText value={String(org.slug || org.id || '')} />
        {href ? (
          <InteractiveLink href={href} external>{websiteUrl}</InteractiveLink>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
        <p className="text-xs text-muted-foreground">{formatAdminDate(org.updatedAt || org.createdAt)}</p>
      </CardContent>
      <Separator className="bg-white/10" />
      <CardFooter className="flex flex-col gap-3 border-0 bg-muted/15 px-5 py-4 sm:flex-row sm:items-end">
        <Field className="flex-1">
          <FieldLabel className="text-xs">{t('name')}</FieldLabel>
          <Input value={name} onChange={e => setName(e.target.value)} className="bg-input/30" />
        </Field>
        <Field className="flex-1">
          <FieldLabel className="text-xs">{t('website')}</FieldLabel>
          <Input value={website} onChange={e => setWebsite(e.target.value)} type="url" className="bg-input/30" />
        </Field>
        <Button
          size="sm"
          disabled={busy || !name.trim()}
          onClick={() => onSave({ name: name.trim(), website: website.trim() ? website.trim() : null })}
        >
          {t('save')}
        </Button>
      </CardFooter>
    </Card>
  )
}
