'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, ProductShell, inputClass, LocaleButton } from '@/components/product/shell'
import { VerificationPanel } from '@/components/product/verification-panel'
import { ThemeStudioPanel } from '@/components/product/theme-studio-panel'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { User } from '@/lib/types'
import type { CustomThemeColors, ThemeCatalogItem } from '@/lib/card-theme'

type Entitlements = {
  tier: User['tier']
  ratingsGivenPerMonth: number
  ratingsReceived: 'unlimited'
  activeTheme: string | null
  themes: string[]
  catalog?: ThemeCatalogItem[]
  rotatingUntil?: string | null
  customTheme: boolean
  companyBrand: { logoUrl: string | null; brandColor: string | null; name?: string | null } | null
  billingCheckoutAvailable: boolean
}

const tabs = ['overview', 'profile', 'privacy', 'verification', 'plan', 'data'] as const
type SettingsTab = (typeof tabs)[number]

function parseTab(value: string | null): SettingsTab {
  if (value && tabs.includes(value as SettingsTab)) return value as SettingsTab
  return 'overview'
}

const statusKey = (value: string) => (value === 'verified' ? 'complete' : 'pending')

export function SettingsWorkspace() {
  const { t } = useI18n()
  const { user, refresh, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = parseTab(searchParams.get('tab'))

  const [form, setForm] = useState<Partial<User>>({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')

  const setTab = useCallback((next: SettingsTab) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next === 'overview') params.delete('tab')
    else params.set('tab', next)
    const query = params.toString()
    router.replace(query ? `/settings?${query}` : '/settings', { scroll: false })
  }, [router, searchParams])

  useEffect(() => {
    const timer = window.setTimeout(() => { if (user) setForm(user) }, 0)
    return () => window.clearTimeout(timer)
  }, [user])

  useEffect(() => {
    if (!user) return
    void api<Entitlements>('/me/entitlements').then(setEntitlements).catch(() => setEntitlements(null))
  }, [user])

  const set = (key: keyof User, value: string | boolean) => setForm(current => ({ ...current, [key]: value }))

  async function save() {
    setBusy(true)
    setMessage('')
    try {
      const payload = {
        name: form.name,
        bio: form.bio || null,
        jobTitle: form.jobTitle || null,
        company: form.company || null,
        industry: form.industry || null,
        university: form.university || null,
        fieldOfStudy: form.fieldOfStudy || null,
        city: form.city || null,
        country: form.country || null,
        profilePublic: Boolean(form.profilePublic),
        emailPublic: Boolean(form.emailPublic),
        phonePublic: Boolean(form.phonePublic),
        locationPublic: Boolean(form.locationPublic),
        companyPublic: Boolean(form.companyPublic),
      }
      await api<User>('/me', { method: 'PATCH', body: JSON.stringify(payload) })
      await refresh()
      setMessage(t('complete'))
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function saveTheme(theme: string) {
    setBusy(true)
    setMessage('')
    try {
      await api('/me/theme', { method: 'PATCH', body: JSON.stringify({ theme }) })
      setEntitlements(current => (current ? { ...current, activeTheme: theme } : current))
      setMessage(t('complete'))
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function saveCustomTheme(custom: CustomThemeColors) {
    setBusy(true)
    setMessage('')
    try {
      const payload = {
        background: custom.background,
        accent: custom.accent,
        ...(custom.logoUrl ? { logoUrl: custom.logoUrl } : {}),
        ...(custom.name ? { name: custom.name } : {}),
      }
      const result = await api<{ theme: string }>('/me/theme', { method: 'PATCH', body: JSON.stringify({ custom: payload }) })
      setEntitlements(current => (current ? { ...current, activeTheme: result.theme } : current))
      setMessage(t('complete'))
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function applyCompanyTheme() {
    setBusy(true)
    setMessage('')
    try {
      const result = await api<{ theme: string }>('/me/theme', { method: 'PATCH', body: JSON.stringify({ company: true }) })
      setEntitlements(current => (current ? { ...current, activeTheme: result.theme } : current))
      setMessage(t('complete'))
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function suggestTheme(mood: string) {
    try {
      return await api<{
        background: string
        accent: string
        label: string
        suggestions?: CustomThemeColors[]
      }>('/me/ai/theme-draft', { method: 'POST', body: JSON.stringify({ mood }) })
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
      return null
    }
  }

  async function exportData() {
    setBusy(true)
    setMessage('')
    try {
      const payload = await api<Record<string, unknown>>('/me/export', { method: 'POST' })
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'rayt-me-account-export.json'
      link.click()
      URL.revokeObjectURL(url)
      setMessage(t('complete'))
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function deleteAccount() {
    setBusy(true)
    setMessage('')
    try {
      await api('/me', { method: 'DELETE', body: JSON.stringify({ confirmation: 'DELETE' }) })
      await logout()
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  const fields: [keyof User, string][] = useMemo(
    () => user?.accountType === 'student'
      ? [['name', t('name')], ['bio', t('bio')], ['university', t('university')], ['fieldOfStudy', t('fieldOfStudy')], ['city', t('city')], ['country', t('country')]]
      : [['name', t('name')], ['bio', t('bio')], ['jobTitle', t('jobTitle')], ['company', t('company')], ['industry', t('industry')], ['city', t('city')], ['country', t('country')]],
    [t, user?.accountType],
  )

  const privacy: [keyof User, string][] = [
    ['profilePublic', t('publicProfile')],
    ['emailPublic', t('publicEmail')],
    ['phonePublic', t('publicPhone')],
    ['locationPublic', t('publicLocation')],
    ['companyPublic', t('publicCompany')],
  ]

  const verificationRows = user?.accountType === 'student'
    ? [['personalEmail', user.personalEmailStatus], ['universityEmail', user.universityEmailStatus]]
    : [['personalEmail', user?.personalEmailStatus], ['workEmail', user?.workEmailStatus], ['phone', user?.phoneStatus]]

  const tabLabels: Record<SettingsTab, string> = {
    overview: t('overview'),
    profile: t('profile'),
    privacy: t('privacy'),
    verification: t('verification'),
    plan: t('plan'),
    data: t('dataRights'),
  }

  return (
    <ProductShell>
      <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <PageHeader eyebrow={t('account')} title={t('settings')} description={t('settingsIntro')} />
        <nav aria-label={t('settings')} className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map(key => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? 'true' : undefined}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${tab === key ? 'bg-primary font-semibold text-primary-foreground' : 'border border-white/15 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
            >
              {tabLabels[key]}
            </button>
          ))}
        </nav>

        <div className="mt-6">
          {tab === 'overview' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title={t('overview')}>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{user?.name}</p>
                <p className="mt-1 text-sm capitalize text-muted-foreground">
                  {user?.isVerified ? t('complete') : t('pending')} · {entitlements?.tier ?? user?.tier}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-muted/20 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t('language')}</p>
                    <p className="text-xs text-muted-foreground">{t('languageHint')}</p>
                  </div>
                  <LocaleButton />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setTab('profile')}>{t('editProfile')}</Button>
                  <Button size="sm" variant="outline" onClick={() => setTab('verification')}>{t('verificationCenter')}</Button>
                  {user?.role === 'admin' ? (
                    <Button size="sm" nativeButton={false} render={<Link href="/admin-dashboard" />}>{t('admin')}</Button>
                  ) : null}
                  {user?.role === 'business' ? (
                    <Button size="sm" nativeButton={false} render={<Link href="/business-dashboard" />}>{t('business')}</Button>
                  ) : null}
                </div>
              </Panel>
              <Panel title={t('accountChecklist')}>
                <ul className="grid gap-2 text-sm">
                  {verificationRows.map(([key, status]) => (
                    <li key={String(key)} className="flex justify-between rounded-xl bg-muted/50 p-3">
                      <span>{t(key as 'personalEmail')}</span>
                      <strong>{t(statusKey(String(status ?? 'pending')))}</strong>
                    </li>
                  ))}
                </ul>
                <Button className="mt-4" variant="outline" size="sm" onClick={() => setTab('verification')}>
                  {t('verificationCenter')}
                </Button>
              </Panel>
            </div>
          )}

          {tab === 'profile' && (
            <Panel title={t('profile')}>
              <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(([key, label]) => (
                  <label className="grid gap-2 text-sm" key={key}>
                    {label}
                    <input className={inputClass} value={String(form[key] ?? '')} onChange={e => set(key, e.target.value)} />
                  </label>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <Button className="min-h-11 px-6" disabled={busy || !form.name} onClick={() => void save()}>{busy ? t('saving') : t('save')}</Button>
              </div>
            </Panel>
          )}

          {tab === 'privacy' && (
            <Panel title={t('privacy')}>
              <div className="grid gap-3">
                {privacy.map(([key, label]) => (
                  <label className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 p-3 text-sm" key={key}>
                    {label}
                    <input type="checkbox" checked={Boolean(form[key])} onChange={e => set(key, e.target.checked)} />
                  </label>
                ))}
              </div>
              <div className="mt-6">
                <Button disabled={busy || !form.name} onClick={() => void save()}>{busy ? t('saving') : t('save')}</Button>
              </div>
            </Panel>
          )}

          {tab === 'verification' && <VerificationPanel />}

          {tab === 'plan' && (
            <div className="grid gap-6">
              <Panel title={t('plan')}>
                <p className="text-3xl font-semibold capitalize">{entitlements?.tier ?? user?.tier}</p>
                <div className="mt-4 grid gap-2 text-sm">
                  <p>{t('ratingsGiven')}: <strong>{entitlements?.ratingsGivenPerMonth ?? '—'}</strong></p>
                  <p>{t('ratingsReceived')}: <strong>{t('unlimited')}</strong></p>
                  {!entitlements?.billingCheckoutAvailable && (
                    <p className="text-muted-foreground">{t('billingUnavailable')}</p>
                  )}
                </div>
              </Panel>
              <Panel title={t('theme')}>
                {entitlements ? (
                  <ThemeStudioPanel
                    entitlements={entitlements}
                    busy={busy}
                    onSavePack={theme => void saveTheme(theme)}
                    onSaveCustom={theme => void saveCustomTheme(theme)}
                    onApplyCompany={() => void applyCompanyTheme()}
                    onSuggest={suggestTheme}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{t('loading')}</p>
                )}
              </Panel>
            </div>
          )}

          {tab === 'data' && (
            <Panel title={t('dataRights')}>
              <div className="grid gap-4 text-sm">
                <p className="text-muted-foreground">{t('exportDataHelp')}</p>
                <Button variant="outline" disabled={busy} onClick={() => void exportData()}>{t('exportData')}</Button>
                <p className="text-muted-foreground">{t('deleteAccountHelp')}</p>
                <label className="grid gap-2">
                  {t('deleteAccount')}
                  <input className={inputClass} value={deleteConfirmation} onChange={event => setDeleteConfirmation(event.target.value)} autoComplete="off" />
                </label>
                <Button variant="outline" disabled={busy || deleteConfirmation !== t('deleteConfirm')} onClick={() => void deleteAccount()}>
                  {t('deleteAccount')}
                </Button>
              </div>
            </Panel>
          )}
        </div>

        {message ? <p role="status" className="mt-4 text-sm text-muted-foreground">{message}</p> : null}
      </main>
    </ProductShell>
  )
}
