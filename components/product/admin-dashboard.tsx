'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  RefreshCw,
  Scale,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PageHeader, ProductShell } from '@/components/product/shell'
import {
  DashboardSurface,
  ErrorBanner,
  FieldGrid,
  FieldItem,
  LoadingBlock,
  RecordShell,
  WorkspaceTabs,
} from '@/components/product/dashboard-ui'
import { AdminMetricsCharts } from '@/components/product/admin-metrics-charts'
import { AdminFieldValue, shouldSkipAdminField } from '@/components/product/admin-field-value'
import { AdminOrganizationCard } from '@/components/product/admin-organization-card'
import { AdminPlanCard } from '@/components/product/admin-plan-card'
import { AdminUserCard, normalizeDbRole } from '@/components/product/admin-user-card'
import { InteractiveLink } from '@/components/product/interactive-value'
import { EmptyState, StatCard } from '@/components/product/brand-art'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'

const sections = [
  ['overview', 'overview', 'overview', 'overview', LayoutDashboard],
  ['users', 'users', 'users', 'roster', Users],
  ['verifications', 'queue', 'verifications', 'queue', ShieldCheck],
  ['ratings', 'ratings', 'ratings', 'reputation', Star],
  ['disputes', 'disputes', 'disputes', 'disputes', Scale],
  ['organizations', 'organizations', 'organizations', 'roster', Building2],
  ['plans', 'plans', 'plans', 'plans', CreditCard],
  ['audit', 'audit', 'audit-log', 'audit', ClipboardList],
  ['health', 'health', 'health', 'reputation', Activity],
  ['analytics', 'analytics', 'analytics', 'plans', BarChart3],
] as const

type SectionKey = (typeof sections)[number][0]
type VerificationType = 'personalEmail' | 'workEmail' | 'universityEmail' | 'phone'

const verificationFields: { type: VerificationType; status: string }[] = [
  { type: 'personalEmail', status: 'personalEmailStatus' },
  { type: 'workEmail', status: 'workEmailStatus' },
  { type: 'universityEmail', status: 'universityEmailStatus' },
  { type: 'phone', status: 'phoneStatus' },
]

function normalize(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object' && Array.isArray((value as { items?: unknown[] }).items)) return (value as { items: unknown[] }).items
  if (value && typeof value === 'object') return Object.entries(value).map(([label, data]) => ({ label, data }))
  return value == null ? [] : [value]
}

const humanize = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/[_-]+/g, ' ').trim()

function isStatEntry(record: unknown): record is { label: string; data: string | number | boolean } {
  const item = record as { label?: unknown; data?: unknown } | null
  return typeof item?.label === 'string' && (typeof item.data === 'string' || typeof item.data === 'number' || typeof item.data === 'boolean')
}

export function AdminDashboard() {
  const { t } = useI18n()
  const [section, setSection] = useState<SectionKey>('overview')
  const [records, setRecords] = useState<unknown[]>([])
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [metrics, setMetrics] = useState<Record<string, number> | null>(null)

  const active = sections.find(([key]) => key === section) ?? sections[0]

  const tabItems = useMemo(
    () => sections.map(([key, label, , , icon]) => ({ id: key, label: t(label), icon })),
    [t],
  )

  const load = useCallback(async () => {
    setBusy(true)
    setError('')
    const endpoint = sections.find(([key]) => key === section)?.[2] || 'overview'
    const query = section === 'users' && search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''
    try {
      const raw = await api<Record<string, unknown>>(`/admin/${endpoint}${query}`)
      if (section === 'overview' || section === 'analytics') {
        const numeric: Record<string, number> = {}
        for (const [key, value] of Object.entries(raw)) {
          if (typeof value === 'number') numeric[key] = value
        }
        setMetrics(numeric)
      } else {
        setMetrics(null)
      }
      setRecords(normalize(raw))
    } catch (cause) {
      setMetrics(null)
      setError(errorMessage(cause, t('loadFailed')))
      setRecords([])
    } finally {
      setBusy(false)
    }
  }, [search, section, t])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function review(item: Record<string, unknown>, status: 'verified' | 'rejected' | 'resolved' | 'dismissed', type?: VerificationType) {
    const prompt = status === 'resolved' ? t('confirmResolve') : status === 'dismissed' ? t('confirmDismiss') : status === 'verified' ? t('confirmApprove') : t('confirmReject')
    if (!window.confirm(prompt)) return
    setBusy(true)
    setError('')
    try {
      if (section === 'verifications') {
        if (!type) throw new Error(t('verificationTypeMissing'))
        const userId = String(item.userId || (item.user as Record<string, unknown> | undefined)?.id || item.id)
        await api(`/admin/verifications/${encodeURIComponent(userId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ type, status }),
        })
      } else {
        const ratingId = String(item.ratingId || item.id)
        await api(`/admin/disputes/${encodeURIComponent(ratingId)}`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        })
      }
      await load()
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
      setBusy(false)
    }
  }

  async function updateUser(item: Record<string, unknown>, data: { role?: string; isActive?: boolean }) {
    setBusy(true)
    setError('')
    try {
      await api(`/admin/users/${encodeURIComponent(String(item.id))}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      await load()
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
      setBusy(false)
    }
  }

  async function updatePlan(item: Record<string, unknown>, activePlan: boolean) {
    setBusy(true)
    setError('')
    try {
      await api(`/admin/plans/${encodeURIComponent(String(item.id))}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: activePlan }),
      })
      await load()
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
      setBusy(false)
    }
  }

  async function createRecord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setBusy(true)
    setError('')
    try {
      if (section === 'organizations') {
        await api('/admin/organizations', {
          method: 'POST',
          body: JSON.stringify({ name: values.name, slug: values.slug }),
        })
      } else if (section === 'plans') {
        await api('/admin/plans', {
          method: 'POST',
          body: JSON.stringify({
            name: values.name,
            code: values.code,
            priceCents: Number(values.priceCents),
            entitlements: {},
          }),
        })
      }
      form.reset()
      await load()
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
      setBusy(false)
    }
  }

  async function moderateRating(item: Record<string, unknown>, isHidden: boolean) {
    setBusy(true)
    setError('')
    try {
      await api(`/admin/ratings/${encodeURIComponent(String(item.id))}/moderate`, {
        method: 'PATCH',
        body: JSON.stringify({ isHidden }),
      })
      await load()
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
      setBusy(false)
    }
  }

  async function updateOrganization(item: Record<string, unknown>, data: { name?: string; website?: string | null }) {
    setBusy(true)
    setError('')
    try {
      await api(`/admin/organizations/${encodeURIComponent(String(item.id))}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      await load()
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
      setBusy(false)
    }
  }

  const statEntries = records.filter(isStatEntry)
  const showStats = statEntries.length > 0 && statEntries.length === records.length

  return (
    <ProductShell role="admin">
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <PageHeader
          eyebrow={t('operations')}
          title={t('admin')}
          description={t('adminIntro')}
          action={
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={busy}>
              <RefreshCw className={busy ? 'animate-spin' : ''} />
              {t('refresh')}
            </Button>
          }
        />

        <WorkspaceTabs tabs={tabItems} value={section} onChange={setSection} ariaLabel={t('admin')} />

        <DashboardSurface title={t(active[1])}>
          {section === 'users' && (
            <form className="mb-6 flex flex-col gap-2 sm:flex-row" onSubmit={event => { event.preventDefault(); void load() }}>
              <Input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder={t('search')}
                className="h-11 bg-input/30"
              />
              <Button type="submit" variant="secondary" className="shrink-0">{t('search')}</Button>
            </form>
          )}

          {(section === 'organizations' || section === 'plans') && (
            <Accordion className="mb-6 rounded-xl border border-white/10 bg-muted/20 px-4">
              <AccordionItem value="create">
                <AccordionTrigger>
                  {section === 'organizations' ? t('createOrganization') : t('createPlan')}
                </AccordionTrigger>
                <AccordionContent>
                  <form onSubmit={createRecord} className="grid gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-4">
                    <Field>
                      <FieldLabel>{t('name')}</FieldLabel>
                      <Input required name="name" className="bg-input/30" />
                    </Field>
                    {section === 'organizations' ? (
                      <Field>
                        <FieldLabel>{t('slug')}</FieldLabel>
                        <Input required name="slug" pattern="[a-z0-9-]+" className="bg-input/30" />
                      </Field>
                    ) : (
                      <>
                        <Field>
                          <FieldLabel>{t('code')}</FieldLabel>
                          <Input required name="code" pattern="[a-z0-9-]+" className="bg-input/30" />
                        </Field>
                        <Field>
                          <FieldLabel>{t('price')}</FieldLabel>
                          <Input required min={0} step={1} type="number" name="priceCents" className="bg-input/30" />
                        </Field>
                      </>
                    )}
                    <Button type="submit" disabled={busy} className="self-end">{t('create')}</Button>
                  </form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {busy ? (
            <LoadingBlock rows={4} />
          ) : error ? (
            <ErrorBanner message={error} onRetry={() => void load()} retryLabel={t('retry')} />
          ) : records.length === 0 ? (
            <EmptyState
              kind={active[3]}
              title={t('emptySection')}
              description={t('emptySectionHelp')}
              action={<Button variant="outline" onClick={() => void load()}>{t('refresh')}</Button>}
            />
          ) : showStats ? (
            <>
              {metrics && (section === 'overview' || section === 'analytics') ? (
                <AdminMetricsCharts mode={section} metrics={metrics} t={t} />
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statEntries.map(entry => (
                  <StatCard key={entry.label} label={humanize(entry.label)} value={String(entry.data)} />
                ))}
              </div>
            </>
          ) : section === 'plans' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {records.map((record, index) => {
                const item = record as Record<string, unknown>
                if (!item.id) return null
                return (
                  <AdminPlanCard
                    key={String(item.id)}
                    plan={item}
                    busy={busy}
                    onToggleActive={() => void updatePlan(item, !Boolean(item.active))}
                    onUpsertEntitlement={(key, value) => {
                      void (async () => {
                        setBusy(true)
                        setError('')
                        try {
                          await api(`/admin/plans/${encodeURIComponent(String(item.id))}/entitlements/${encodeURIComponent(key)}`, {
                            method: 'PUT',
                            body: JSON.stringify({ value }),
                          })
                          await load()
                        } catch (cause) {
                          setError(errorMessage(cause, t('error')))
                          setBusy(false)
                        }
                      })()
                    }}
                  />
                )
              })}
            </div>
          ) : section === 'organizations' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {records.map((record, index) => {
                const item = record as Record<string, unknown>
                if (!item.id) return null
                return (
                  <AdminOrganizationCard
                    key={String(item.id)}
                    org={item}
                    busy={busy}
                    onSave={data => void updateOrganization(item, data)}
                  />
                )
              })}
            </div>
          ) : section === 'users' ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {records.map((record, index) => {
                const item = record as Record<string, unknown>
                if (!item.id) return null
                return (
                  <AdminUserCard
                    key={String(item.id)}
                    name={String(item.name || t('users'))}
                    email={String(item.email || '')}
                    role={normalizeDbRole(item.role)}
                    isVerified={Boolean(item.isVerified)}
                    isActive={Boolean(item.isActive)}
                    createdAt={item.createdAt ? String(item.createdAt) : undefined}
                    busy={busy}
                    onRoleChange={role => void updateUser(item, { role })}
                    onToggleActive={() => void updateUser(item, { isActive: !Boolean(item.isActive) })}
                  />
                )
              })}
            </div>
          ) : (
            <div className="grid gap-3">
              {records.map((record, index) => {
                const item = record as Record<string, unknown>
                const id = String(item?.id || item?.label || index)
                const title = section === 'verifications'
                  ? String(item.name || item.id)
                  : String(item.name || item.code || item.id || index)

                const email = String(item.personalEmail || item.workEmail || item.email || '')
                const subtitle = section === 'verifications' && email
                  ? undefined
                  : email || undefined

                return (
                  <RecordShell
                    key={id}
                    title={title}
                    subtitle={subtitle && section !== 'verifications' ? subtitle : undefined}
                  >
                    <div className="flex w-full min-w-0 flex-col gap-4 lg:max-w-3xl">
                      {section === 'verifications' && email ? (
                        <InteractiveLink href={`mailto:${email}`}>{email}</InteractiveLink>
                      ) : null}
                      <FieldGrid>
                        {Object.entries(item)
                          .filter(([key]) => !shouldSkipAdminField(key))
                          .slice(0, 10)
                          .map(([key, value]) => (
                            <FieldItem key={key} label={humanize(key)} value={<AdminFieldValue fieldKey={key} value={value} />} />
                          ))}
                      </FieldGrid>
                      {section === 'verifications' && (item.id || item.userId) ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {verificationFields
                            .filter(field => {
                              const required = item.accountType === 'student'
                                ? field.type === 'personalEmail' || field.type === 'universityEmail'
                                : field.type === 'personalEmail' || field.type === 'workEmail' || field.type === 'phone'
                              return required && item[field.status] === 'pending'
                            })
                            .map(field => (
                              <div key={field.type} className="rounded-xl border border-white/10 bg-background/40 p-3">
                                <p className="mb-2 text-xs font-semibold text-foreground">{t(field.type)}</p>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => void review(item, 'verified', field.type)}>{t('approve')}</Button>
                                  <Button size="sm" variant="outline" onClick={() => void review(item, 'rejected', field.type)}>{t('reject')}</Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : null}
                      {section === 'disputes' && (item.id || item.ratingId) ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => void review(item, 'resolved')}>{t('resolve')}</Button>
                          <Button size="sm" variant="outline" onClick={() => void review(item, 'dismissed')}>{t('dismiss')}</Button>
                        </div>
                      ) : null}
                      {section === 'ratings' && item.id ? (
                        <Button size="sm" variant="outline" onClick={() => void moderateRating(item, !Boolean(item.isHidden))}>
                          {Boolean(item.isHidden) ? t('showRating') : t('hideRating')}
                        </Button>
                      ) : null}
                    </div>
                  </RecordShell>
                )
              })}
            </div>
          )}
        </DashboardSurface>
      </main>
    </ProductShell>
  )
}
