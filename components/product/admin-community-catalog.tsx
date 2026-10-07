'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useI18n } from '@/components/product/providers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RecordShell } from '@/components/product/dashboard-ui'

type CatalogRow = {
  key: string
  categoryKey: string
  labelEn: string
  labelAr: string
  embeddingText: string
  isActive: boolean
  sortOrder: number
}

const CATEGORY_KEYS = [
  'leadership_business',
  'engineering_technology',
  'skilled_trades',
  'architecture_design',
  'creative_media_entertainment',
  'barbering_beauty',
  'professional_financial_services',
  'health_science_education',
  'industry_operations',
  'public_government_defense',
  'hospitality_travel',
  'sales_retail_other',
] as const

export function AdminCommunityCatalogPanel() {
  const { t, locale } = useI18n()
  const [items, setItems] = useState<CatalogRow[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    key: '',
    categoryKey: 'sales_retail_other',
    labelEn: '',
    labelAr: '',
    embeddingText: '',
  })

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    try {
      const data = await api<{ items: CatalogRow[] }>('/admin/community-groups')
      setItems(data.items ?? [])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('loadFailed'))
    } finally {
      setBusy(false)
    }
  }, [t])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function submit() {
    setBusy(true)
    setError('')
    try {
      await api('/admin/community-groups', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setForm({
        key: '',
        categoryKey: 'sales_retail_other',
        labelEn: '',
        labelAr: '',
        embeddingText: '',
      })
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('loadFailed'))
    } finally {
      setBusy(false)
    }
  }

  async function reindexAll() {
    setBusy(true)
    setError('')
    try {
      await api('/admin/community-groups/reindex', { method: 'POST', body: '{}' })
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('loadFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-background/40 p-4">
        <h3 className="text-sm font-semibold text-foreground">{t('communityCatalogAdd')}</h3>
        <p className="text-xs text-muted-foreground">{t('communityCatalogAddHint')}</p>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="cg-key">{t('communityGroupKey')}</Label>
            <Input
              id="cg-key"
              value={form.key}
              onChange={event => setForm(current => ({ ...current, key: event.target.value }))}
              placeholder="renewable_energy"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cg-cat">{t('communityGroupCategory')}</Label>
            <select
              id="cg-cat"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={form.categoryKey}
              onChange={event =>
                setForm(current => ({ ...current, categoryKey: event.target.value }))
              }
            >
              {CATEGORY_KEYS.map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cg-en">{t('labelEn')}</Label>
            <Input
              id="cg-en"
              value={form.labelEn}
              onChange={event => setForm(current => ({ ...current, labelEn: event.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cg-ar">{t('labelAr')}</Label>
            <Input
              id="cg-ar"
              value={form.labelAr}
              onChange={event => setForm(current => ({ ...current, labelAr: event.target.value }))}
              dir="rtl"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="cg-embed">{t('communityEmbeddingText')}</Label>
          <textarea
            id="cg-embed"
            rows={3}
            className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.embeddingText}
            onChange={event =>
              setForm(current => ({ ...current, embeddingText: event.target.value }))
            }
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={busy} onClick={() => void submit()}>
            {t('communityCatalogCreate')}
          </Button>
          <Button type="button" variant="outline" disabled={busy} onClick={() => void reindexAll()}>
            {t('communityCatalogReindex')}
          </Button>
        </div>
      </div>
      <div className="grid gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {t('communityCatalogDefinitions')} ({items.length})
        </h3>
        {items.slice(0, 40).map(row => (
          <RecordShell
            key={row.key}
            title={locale === 'ar' ? row.labelAr : row.labelEn}
            subtitle={`${row.key} · ${row.categoryKey}${row.isActive ? '' : ' · inactive'}`}
          />
        ))}
      </div>
    </div>
  )
}
