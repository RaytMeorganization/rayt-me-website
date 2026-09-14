'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CopyableText, formatAdminDate, formatPriceCents } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'
import {
  centsToUsd,
  marketingPlanByCode,
  matchesMarketingPrice,
  planPeriodLabel,
  usdToCents,
} from '@/lib/plan-pricing'

type Entitlement = { id?: string; key: string; value: number }

export function AdminPlanCard({
  plan,
  busy,
  onToggleActive,
  onUpsertEntitlement,
  onSaveDetails,
}: {
  plan: Record<string, unknown>
  busy?: boolean
  onToggleActive: () => void
  onUpsertEntitlement: (key: string, value: number) => void
  onSaveDetails: (data: { name: string; priceCents: number }) => void
}) {
  const { t } = useI18n()
  const [draftKey, setDraftKey] = useState('')
  const [draftValue, setDraftValue] = useState('')
  const [name, setName] = useState(String(plan.name || ''))
  const [priceUsd, setPriceUsd] = useState(String(centsToUsd(Number(plan.priceCents ?? 0))))

  useEffect(() => {
    setName(String(plan.name || ''))
    setPriceUsd(String(centsToUsd(Number(plan.priceCents ?? 0))))
  }, [plan.id, plan.name, plan.priceCents])

  const entitlements = Array.isArray(plan.entitlements)
    ? (plan.entitlements as Entitlement[])
    : []

  const code = String(plan.code || '')
  const catalog = marketingPlanByCode(code)
  const priceCents = Number(plan.priceCents ?? 0)
  const priceAligned = matchesMarketingPrice(code, priceCents)

  function pickEntitlement(ent: Entitlement) {
    setDraftKey(ent.key)
    setDraftValue(String(ent.value))
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const key = draftKey.trim()
    const value = Number(draftValue)
    if (!key || !Number.isFinite(value)) return
    onUpsertEntitlement(key, value)
    setDraftKey('')
    setDraftValue('')
  }

  function saveDetails() {
    const dollars = Number(priceUsd)
    if (!name.trim() || !Number.isFinite(dollars) || dollars < 0) return
    onSaveDetails({ name: name.trim(), priceCents: usdToCents(dollars) })
  }

  const active = Boolean(plan.active)

  return (
    <Card className="overflow-hidden border-white/10 bg-card/90 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="h-[3px] bg-primary" />
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">{String(plan.name || t('plans'))}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <CopyableText value={code} label={t('code')} />
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={active ? 'default' : 'outline'} className="rounded-full">
              {active ? t('activate') : t('deactivate')}
            </Badge>
            {catalog ? (
              <Badge variant={priceAligned === true ? 'secondary' : 'destructive'} className="rounded-full">
                {priceAligned === true ? t('marketingPriceMatch') : t('marketingPriceMismatch')}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-muted/20 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('priceUsd')}</p>
            <p className="mt-1 font-mono text-2xl tabular-nums text-foreground">{formatPriceCents(plan.priceCents)}</p>
            {catalog ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {planPeriodLabel(catalog.period, t)}
              </p>
            ) : null}
          </div>
          <div className="rounded-xl border border-white/10 bg-muted/20 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('plan')}</p>
            <CopyableText value={String(plan.id || '')} className="mt-1 w-full" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field>
            <FieldLabel className="text-xs">{t('name')}</FieldLabel>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-input/30" />
          </Field>
          <Field>
            <FieldLabel className="text-xs">{t('priceUsd')}</FieldLabel>
            <Input
              type="number"
              min={0}
              step={1}
              value={priceUsd}
              onChange={e => setPriceUsd(e.target.value)}
              className="bg-input/30 font-mono"
            />
          </Field>
        </div>
        <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={saveDetails}>
          {t('save')}
        </Button>

        <p className="text-xs text-muted-foreground">{formatAdminDate(plan.updatedAt)}</p>

        <div>
          <p className="mb-2 text-sm font-medium text-foreground">{t('entitlements')}</p>
          {entitlements.length ? (
            <div className="flex flex-wrap gap-2">
              {entitlements.map(ent => (
                <button
                  key={ent.id ?? ent.key}
                  type="button"
                  onClick={() => pickEntitlement(ent)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-left text-xs transition hover:border-primary/40 hover:bg-primary/10"
                >
                  <span className="font-medium text-foreground">{ent.key}</span>
                  <span className="ms-2 font-mono tabular-nums text-muted-foreground">{ent.value}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t('noData')}</p>
          )}
        </div>
      </CardContent>
      <Separator className="bg-white/10" />
      <CardFooter className="flex flex-col gap-3 border-0 bg-muted/15 px-5 py-4">
        <form onSubmit={submit} className="grid w-full gap-3 sm:grid-cols-[1fr_6rem_auto]">
          <Field>
            <FieldLabel className="text-xs">{t('entitlementKey')}</FieldLabel>
            <Input
              value={draftKey}
              onChange={e => setDraftKey(e.target.value)}
              placeholder={t('entitlementKey')}
              className="bg-input/30"
              required
            />
          </Field>
          <Field>
            <FieldLabel className="text-xs">{t('entitlementValue')}</FieldLabel>
            <Input
              type="number"
              min={0}
              value={draftValue}
              onChange={e => setDraftValue(e.target.value)}
              className="bg-input/30 font-mono"
              required
            />
          </Field>
          <Button type="submit" size="sm" className="self-end" disabled={busy}>{t('save')}</Button>
        </form>
        <Button type="button" variant="outline" size="sm" className="self-start" disabled={busy} onClick={onToggleActive}>
          {active ? t('deactivate') : t('activate')}
        </Button>
      </CardFooter>
    </Card>
  )
}
