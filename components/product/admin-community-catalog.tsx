'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
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

type OverviewCountry = {
  key: string
  labelEn: string
  labelAr: string
  memberCount: number
  activeCommunities: number
}

type OverviewCategory = {
  key: string
  labelEn: string
  labelAr: string
  groupCount: number
  memberCount: number
  groups: { key: string; labelEn: string; labelAr: string; memberCount: number }[]
}

type Overview = {
  catalogGroupCount: number
  catalogCategoryCount: number
  countries: OverviewCountry[]
  categories: OverviewCategory[]
}

type MemberRow = {
  joinedAt: string
  user: {
    id: string
    name: string | null
    email: string
    country: string | null
    jobTitle: string | null
    company: string | null
  }
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
  const [overview, setOverview] = useState<Overview | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [membersCountry, setMembersCountry] = useState('')
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
      const [catalog, ov] = await Promise.all([
        api<{ items: CatalogRow[]; total: number }>('/admin/community-groups'),
        api<Overview>('/admin/communities/overview'),
      ])
      setItems(catalog.items ?? [])
      setOverview(ov)
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

  const grouped = useMemo(() => {
    const map = new Map<string, CatalogRow[]>()
    for (const key of CATEGORY_KEYS) map.set(key, [])
    for (const row of items) {
      const bucket = map.get(row.categoryKey) ?? []
      bucket.push(row)
      map.set(row.categoryKey, bucket)
    }
    return CATEGORY_KEYS.map(key => ({
      key,
      rows: (map.get(key) ?? []).sort((a, b) => a.sortOrder - b.sortOrder || a.key.localeCompare(b.key)),
    }))
  }, [items])

  const filteredGroups = useMemo(() => {
    if (filterCategory === 'all') return grouped
    return grouped.filter(section => section.key === filterCategory)
  }, [filterCategory, grouped])

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

  async function patchCategory(row: CatalogRow, categoryKey: string) {
    if (categoryKey === row.categoryKey) return
    setBusy(true)
    setError('')
    try {
      await api(`/admin/community-groups/${encodeURIComponent(row.key)}`, {
        method: 'PATCH',
        body: JSON.stringify({ categoryKey }),
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

  async function loadMembers(groupKey: string) {
    setExpandedGroup(groupKey)
    setMembers([])
    try {
      const params = new URLSearchParams({ limit: '40' })
      if (membersCountry.trim()) params.set('country', membersCountry.trim())
      const data = await api<{ items: MemberRow[]; total: number }>(
        `/admin/community-groups/${encodeURIComponent(groupKey)}/members?${params}`,
      )
      setMembers(data.items ?? [])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('loadFailed'))
    }
  }

  const categoryLabel = (key: string) => {
    const cat = overview?.categories.find(c => c.key === key)
    if (!cat) return key
    return locale === 'ar' ? cat.labelAr : cat.labelEn
  }

  return (
    <div className="grid gap-6">
      {overview ? (
        <div className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{t('communityOverviewTitle')}</h3>
              <p className="text-xs text-muted-foreground">
                {t('communityOverviewMeta', {
                  groups: overview.catalogGroupCount,
                  categories: overview.catalogCategoryCount,
                })}
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {overview.countries.slice(0, 12).map(country => (
              <div
                key={country.key}
                className="rounded-2xl border border-white/10 bg-background/50 p-4 shadow-sm"
              >
                <p className="text-sm font-medium text-foreground">
                  {locale === 'ar' ? country.labelAr : country.labelEn}
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                  {country.memberCount}
                </p>
                <p className="text-xs text-muted-foreground">{t('communityCountryMembers')}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t('communityActiveGroups', { count: country.activeCommunities })}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
                <option key={key} value={key}>{categoryLabel(key)}</option>
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

      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {t('communityCatalogDefinitions')} ({items.length})
          </h3>
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            aria-label={t('communityGroupCategory')}
          >
            <option value="all">{t('communityFilterAllCategories')}</option>
            {CATEGORY_KEYS.map(key => (
              <option key={key} value={key}>{categoryLabel(key)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            placeholder={t('communityMembersCountryFilter')}
            value={membersCountry}
            onChange={e => setMembersCountry(e.target.value)}
          />
        </div>
        {filteredGroups.map(section => (
          <div key={section.key} className="grid gap-2 rounded-xl border border-white/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {categoryLabel(section.key)} ({section.rows.length})
            </p>
            <div className="grid gap-2 lg:grid-cols-2">
              {section.rows.map(row => (
                <div
                  key={row.key}
                  className="rounded-lg border border-white/5 bg-background/30 p-3"
                >
                  <RecordShell
                    title={locale === 'ar' ? row.labelAr : row.labelEn}
                    subtitle={`${row.key}${row.isActive ? '' : ' · inactive'}`}
                  />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <select
                      className="h-9 flex-1 min-w-[140px] rounded-md border border-input bg-background px-2 text-xs"
                      value={row.categoryKey}
                      onChange={e => void patchCategory(row, e.target.value)}
                      disabled={busy}
                    >
                      {CATEGORY_KEYS.map(key => (
                        <option key={key} value={key}>{categoryLabel(key)}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => void loadMembers(row.key)}
                    >
                      {t('communityViewMembers')}
                    </Button>
                  </div>
                  {expandedGroup === row.key && members.length > 0 ? (
                    <ul className="mt-2 grid gap-1 text-xs text-muted-foreground">
                      {members.map(m => (
                        <li key={m.user.id}>
                          {m.user.name ?? m.user.email}
                          {m.user.jobTitle ? ` · ${m.user.jobTitle}` : ''}
                          {m.user.country ? ` · ${m.user.country}` : ''}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
