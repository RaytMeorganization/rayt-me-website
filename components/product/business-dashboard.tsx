'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Building2,
  CreditCard,
  Palette,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PageHeader, ProductShell, inputClass } from '@/components/product/shell'
import {
  DashboardSurface,
  ErrorBanner,
  LoadingBlock,
  RecordShell,
  StatusBadge,
  WorkspaceTabs,
} from '@/components/product/dashboard-ui'
import { WorkspaceMemberCard } from '@/components/product/workspace-member-card'
import { EmptyState, Illustration, StatCard } from '@/components/product/brand-art'
import { AnimatedNumber } from '@/components/product/premium-motion'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { BusinessReputation, BusinessUsage, Organization } from '@/lib/types'

type BusinessTab = 'overview' | 'organization' | 'team' | 'brand' | 'usage'

export function BusinessDashboard() {
  const { t } = useI18n()
  const [tab, setTab] = useState<BusinessTab>('overview')
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<Record<string, unknown>[]>([])
  const [invites, setInvites] = useState<Record<string, unknown>[]>([])
  const [reputation, setReputation] = useState<BusinessReputation | null>(null)
  const [theme, setTheme] = useState<{ logoUrl: string | null; brandColor: string | null }>({ logoUrl: null, brandColor: null })
  const [usage, setUsage] = useState<BusinessUsage | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(true)
  const [ready, setReady] = useState(false)

  const tabs = useMemo(
    () => [
      { id: 'overview' as const, label: t('overview'), icon: Sparkles },
      { id: 'organization' as const, label: t('organizationProfile'), icon: Building2 },
      { id: 'team' as const, label: t('roster'), icon: Users },
      { id: 'brand' as const, label: t('brandedTheme'), icon: Palette },
      { id: 'usage' as const, label: t('usage'), icon: CreditCard },
    ],
    [t],
  )

  const load = useCallback(async () => {
    setBusy(true)
    setMessage('')
    const results = await Promise.allSettled([
      api<Organization>('/business/organization'),
      api<Record<string, unknown>[]>('/business/members'),
      api<Record<string, unknown>[]>('/business/invites'),
      api<BusinessReputation>('/business/reputation'),
      api<{ logoUrl: string | null; brandColor: string | null }>('/business/theme'),
      api<BusinessUsage>('/business/usage'),
    ])
    if (results[0].status === 'fulfilled') setOrganization(results[0].value)
    if (results[1].status === 'fulfilled') setMembers(results[1].value)
    if (results[2].status === 'fulfilled') setInvites(results[2].value)
    if (results[3].status === 'fulfilled') setReputation(results[3].value)
    if (results[4].status === 'fulfilled') setTheme(results[4].value)
    if (results[5].status === 'fulfilled') setUsage(results[5].value)
    const failure = results.find(result => result.status === 'rejected')
    if (failure?.status === 'rejected') setMessage(errorMessage(failure.reason, t('loadFailed')))
    setBusy(false)
    setReady(true)
  }, [t])

  useEffect(() => {
    const timer = window.setTimeout(() => { void load() }, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  async function saveOrganization() {
    if (!organization) return
    setBusy(true)
    setMessage('')
    try {
      const payload = {
        name: organization.name,
        description: organization.description || null,
        website: organization.website || null,
        logoUrl: organization.logoUrl || null,
      }
      setOrganization(await api<Organization>('/business/organization', { method: 'PATCH', body: JSON.stringify(payload) }))
      setMessage(t('complete'))
    } catch (cause) {
      setMessage(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function invite(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const created = await api<{ devToken?: string }>('/business/invites', {
        method: 'POST',
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      setInviteEmail('')
      setMessage(created.devToken ? `${t('inviteLink')}: ${window.location.origin}/accept-invite?token=${created.devToken}` : t('complete'))
      await load()
    } catch (cause) {
      setMessage(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function revokeInvite(id: string) {
    if (!window.confirm(t('confirmRevoke'))) return
    setBusy(true)
    setMessage('')
    try {
      await api(`/business/invites/${encodeURIComponent(id)}`, { method: 'DELETE' })
      await load()
    } catch (cause) {
      setMessage(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function removeMember(id: string) {
    if (!window.confirm(t('confirmRemoveMember'))) return
    setBusy(true)
    setMessage('')
    try {
      await api(`/business/members/${encodeURIComponent(id)}`, { method: 'DELETE' })
      await load()
    } catch (cause) {
      setMessage(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function saveTheme() {
    setBusy(true)
    setMessage('')
    try {
      const payload = {
        logoUrl: theme.logoUrl || null,
        ...(theme.brandColor ? { brandColor: theme.brandColor } : {}),
      }
      setTheme(await api<{ logoUrl: string | null; brandColor: string | null }>('/business/theme', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }))
      setMessage(t('complete'))
    } catch (cause) {
      setMessage(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  const orgInitials = (organization?.name || 'OR').slice(0, 2).toUpperCase()

  return (
    <ProductShell role="business">
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <PageHeader
          eyebrow={t('organizationWorkspace')}
          title={organization?.name || t('business')}
          description={t('businessIntro')}
          action={
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={busy}>
              <RefreshCw className={busy ? 'animate-spin' : ''} />
              {t('refresh')}
            </Button>
          }
        />

        {message ? (
          <p role="status" className="mt-5 rounded-xl border border-white/10 bg-card/80 px-4 py-3 text-sm text-foreground">
            {message}
          </p>
        ) : null}

        {!ready ? (
          <div className="mt-8">
            <LoadingBlock rows={4} />
          </div>
        ) : (
          <>
            <WorkspaceTabs tabs={tabs} value={tab} onChange={setTab} ariaLabel={t('business')} />

            {tab === 'overview' && (
              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label={t('reputation')}
                    value={reputation ? reputation.averageReputation.toFixed(1) : '—'}
                    hint={`${reputation?.ratingCount ?? 0} ${t('basedOn')}`}
                  />
                  <StatCard
                    label={t('averageRating')}
                    value={reputation ? reputation.averageRating.toFixed(1) : '—'}
                    hint={t('ratingCount')}
                  />
                  <StatCard label={t('members')} value={String(usage?.usage.members ?? members.length)} hint={t('roster')} />
                  <StatCard label={t('plan')} value={usage?.plan || '—'} hint={usage?.status || t('status')} />
                </div>

                <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-card/95 via-card/80 to-primary/10 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)]">
                  <CardContent className="flex flex-wrap items-center justify-between gap-6 py-8">
                    <div className="flex items-center gap-4">
                      <Avatar className="size-14 border border-white/10">
                        <AvatarFallback className="bg-primary/20 text-lg font-semibold text-foreground">{orgInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t('reputation')}</p>
                        <p className="font-serif text-5xl font-semibold tabular-nums tracking-tight text-foreground">
                          {reputation ? <AnimatedNumber value={reputation.averageReputation} decimals={1} /> : '—'}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {reputation?.ratingCount || 0} {t('basedOn')}
                        </p>
                      </div>
                    </div>
                    <Illustration kind="reputation" className="w-36 shrink-0 opacity-90" />
                  </CardContent>
                </Card>
              </div>
            )}

            {tab === 'organization' && (
              <DashboardSurface title={t('organizationProfile')} description={t('businessIntro')}>
                <div className="grid max-w-2xl gap-4">
                  <Field>
                    <FieldLabel>{t('name')}</FieldLabel>
                    <Input
                      className="bg-input/30"
                      value={organization?.name || ''}
                      onChange={e => setOrganization(current => (current ? { ...current, name: e.target.value } : { id: '', name: e.target.value }))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t('description')}</FieldLabel>
                    <textarea
                      className={`${inputClass} min-h-28 py-3`}
                      value={organization?.description || ''}
                      onChange={e => setOrganization(current => (current ? { ...current, description: e.target.value } : null))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t('website')}</FieldLabel>
                    <Input
                      type="url"
                      className="bg-input/30"
                      value={organization?.website || ''}
                      onChange={e => setOrganization(current => (current ? { ...current, website: e.target.value } : null))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t('logoUrl')}</FieldLabel>
                    <Input
                      type="url"
                      className="bg-input/30"
                      value={organization?.logoUrl || ''}
                      onChange={e => setOrganization(current => (current ? { ...current, logoUrl: e.target.value } : null))}
                    />
                  </Field>
                  <Button disabled={busy || !organization} onClick={() => void saveOrganization()}>
                    {busy ? t('saving') : t('save')}
                  </Button>
                </div>
              </DashboardSurface>
            )}

            {tab === 'team' && (
              <DashboardSurface title={t('roster')} description={t('emptyRosterHelp')}>
                <form onSubmit={invite} className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <Input
                    required
                    type="email"
                    className="bg-input/30"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder={t('email')}
                  />
                  <select
                    aria-label={t('role')}
                    className={`${inputClass} sm:w-44`}
                    value={inviteRole}
                    onChange={event => setInviteRole(event.target.value as 'MEMBER' | 'ADMIN')}
                  >
                    <option value="MEMBER">{t('memberRole')}</option>
                    <option value="ADMIN">{t('organizationAdminRole')}</option>
                  </select>
                  <Button type="submit" disabled={busy}>{t('invite')}</Button>
                </form>

                <Separator className="my-6 bg-white/10" />

                {members.length ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {members.map((member, index) => {
                      const user = member.user as Record<string, unknown> | undefined
                      const name = String(user?.name || t('members'))
                      const email = String(user?.email || '')
                      return (
                        <WorkspaceMemberCard
                          key={String(member.id || index)}
                          name={name}
                          email={email}
                          jobTitle={user?.jobTitle ? String(user.jobTitle) : null}
                          score={user?.score != null ? Number(user.score) : null}
                          isVerified={Boolean(user?.isVerified)}
                          role={String(member.role)}
                          accentColor={theme.brandColor || organization?.logoUrl}
                          canRemove={String(member.role) !== 'ADMIN'}
                          busy={busy}
                          onRemove={() => void removeMember(String(member.id))}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <EmptyState kind="roster" title={t('emptyRoster')} description={t('emptyRosterHelp')} />
                )}

                <h3 className="mt-8 text-sm font-semibold text-foreground">{t('pendingInvites')}</h3>
                {invites.length ? (
                  <div className="mt-3 grid gap-2">
                    {invites.map((item, index) => (
                      <RecordShell
                        key={String(item.id || index)}
                        title={String(item.email)}
                        badges={
                          <StatusBadge tone={String(item.status) === 'PENDING' ? 'warn' : 'muted'}>
                            {String(item.status)}
                          </StatusBadge>
                        }
                      >
                        {String(item.status) === 'PENDING' ? (
                          <Button size="sm" variant="outline" disabled={busy} onClick={() => void revokeInvite(String(item.id))}>
                            {t('revoke')}
                          </Button>
                        ) : null}
                      </RecordShell>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{t('emptyInvites')}</p>
                )}
              </DashboardSurface>
            )}

            {tab === 'brand' && (
              <DashboardSurface title={t('brandedTheme')}>
                <div className="grid max-w-lg gap-4">
                  <Field>
                    <FieldLabel>{t('logoUrl')}</FieldLabel>
                    <Input
                      type="url"
                      className="bg-input/30"
                      value={theme.logoUrl || ''}
                      onChange={e => setTheme(current => ({ ...current, logoUrl: e.target.value }))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t('brandColor')}</FieldLabel>
                    <Input
                      type="color"
                      aria-label={t('brandColor')}
                      className="h-12 w-full cursor-pointer bg-input/30 p-1"
                      value={theme.brandColor || '#11213D'}
                      onChange={e => setTheme(current => ({ ...current, brandColor: e.target.value }))}
                    />
                  </Field>
                  <Card className="border-white/10 bg-muted/20 shadow-none" style={{ borderInlineStart: `4px solid ${theme.brandColor || 'var(--primary)'}` }}>
                    <CardHeader>
                      <CardTitle className="text-base">{organization?.name || t('brandedTheme')}</CardTitle>
                      <CardDescription>{t('businessIntro')}</CardDescription>
                    </CardHeader>
                  </Card>
                  <Button disabled={busy} onClick={() => void saveTheme()}>{busy ? t('saving') : t('save')}</Button>
                </div>
              </DashboardSurface>
            )}

            {tab === 'usage' && (
              <DashboardSurface title={t('usage')}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard label={t('plan')} value={usage?.plan || '—'} hint={usage?.status || t('status')} />
                  <StatCard label={t('members')} value={String(usage?.usage.members ?? 0)} />
                  <StatCard label={t('pendingInvites')} value={String(usage?.usage.pendingInvites ?? 0)} />
                </div>
                <h3 className="mt-8 text-sm font-semibold text-foreground">{t('entitlements')}</h3>
                {usage?.entitlements.length ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {usage.entitlements.map(item => (
                      <div key={item.key} className="flex items-center justify-between rounded-xl border border-white/10 bg-muted/20 px-4 py-3 text-sm">
                        <span className="text-muted-foreground">{item.key}</span>
                        <span className="font-mono font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{t('noData')}</p>
                )}
              </DashboardSurface>
            )}
          </>
        )}

        {!ready && message ? <ErrorBanner message={message} retryLabel={t('retry')} onRetry={() => void load()} /> : null}
      </main>
    </ProductShell>
  )
}
