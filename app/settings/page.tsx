'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, ProductShell, inputClass } from '@/components/product/shell'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { User } from '@/lib/types'

type Entitlements = {
  tier: User['tier']
  ratingsGivenPerMonth: number
  ratingsReceived: 'unlimited'
  activeTheme: string | null
  themes: string[]
  customTheme: boolean
  companyBrand: { logoUrl: string | null; brandColor: string | null } | null
  billingCheckoutAvailable: boolean
}

export default function SettingsPage() {
  const { t } = useI18n()
  const { user, refresh, logout } = useAuth()
  const [form, setForm] = useState<Partial<User>>({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null)
  const [customTheme, setCustomTheme] = useState({ background: '#F7F8F4', accent: '#17352C' })
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
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
    setBusy(true); setMessage('')
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
      await refresh(); setMessage(t('complete'))
    } catch (error) { setMessage(errorMessage(error, t('error'))) } finally { setBusy(false) }
  }
  async function saveTheme(theme: string) {
    setBusy(true); setMessage('')
    try {
      await api('/me/theme', { method: 'PATCH', body: JSON.stringify({ theme }) })
      setEntitlements(current => current ? { ...current, activeTheme: theme } : current)
      setMessage(t('complete'))
    } catch (error) { setMessage(errorMessage(error, t('error'))) } finally { setBusy(false) }
  }
  async function exportData() {
    setBusy(true); setMessage('')
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
    } catch (error) { setMessage(errorMessage(error, t('error'))) } finally { setBusy(false) }
  }
  async function deleteAccount() {
    setBusy(true); setMessage('')
    try {
      await api('/me', { method: 'DELETE', body: JSON.stringify({ confirmation: 'DELETE' }) })
      await logout()
    } catch (error) { setMessage(errorMessage(error, t('error'))) } finally { setBusy(false) }
  }

  async function saveCustomTheme() {
    setBusy(true); setMessage('')
    try {
      const result = await api<{ theme: string }>('/me/theme', { method: 'PATCH', body: JSON.stringify({ custom: customTheme }) })
      setEntitlements(current => current ? { ...current, activeTheme: result.theme } : current)
      setMessage(t('complete'))
    } catch (error) { setMessage(errorMessage(error, t('error'))) } finally { setBusy(false) }
  }

  const fields: [keyof User, string][] = user?.accountType === 'student'
    ? [['name', t('name')], ['bio', t('bio')], ['university', t('university')], ['fieldOfStudy', t('fieldOfStudy')], ['city', t('city')], ['country', t('country')]]
    : [['name', t('name')], ['bio', t('bio')], ['jobTitle', t('jobTitle')], ['company', t('company')], ['industry', t('industry')], ['city', t('city')], ['country', t('country')]]
  const privacy: [keyof User, string][] = [['profilePublic', t('publicProfile')], ['emailPublic', t('publicEmail')], ['phonePublic', t('publicPhone')], ['locationPublic', t('publicLocation')], ['companyPublic', t('publicCompany')]]

  return <ProductShell><main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
    <PageHeader eyebrow={t('account')} title={t('settings')} description={t('settingsIntro')} />
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><Panel title={t('profile')}><div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label className="grid gap-2 text-sm" key={key}>{label}<input className={inputClass} value={String(form[key] ?? '')} onChange={e => set(key, e.target.value)} /></label>)}</div></Panel>
      <div className="grid gap-6"><Panel title={t('privacy')}><div className="grid gap-3">{privacy.map(([key, label]) => <label className="flex items-center justify-between gap-4 rounded-xl bg-[#f7f8f4] p-3 text-sm" key={key}>{label}<input type="checkbox" checked={Boolean(form[key])} onChange={e => set(key, e.target.checked)} /></label>)}</div></Panel></div>
      <Panel title={t('plan')}><p className="text-3xl font-semibold capitalize">{entitlements?.tier ?? user?.tier}</p><div className="mt-4 grid gap-2 text-sm"><p>{t('ratingsGiven')}: <strong>{entitlements?.ratingsGivenPerMonth ?? '—'}</strong></p><p>{t('ratingsReceived')}: <strong>{t('unlimited')}</strong></p>{!entitlements?.billingCheckoutAvailable && <p className="text-muted-foreground">{t('billingUnavailable')}</p>}</div></Panel>
      <Panel title={t('theme')}><div className="grid gap-3"><label className="grid gap-2 text-sm">{t('theme')}<select className={inputClass} value={entitlements?.activeTheme && entitlements.themes.includes(entitlements.activeTheme) ? entitlements.activeTheme : 'forest'} disabled={busy || !entitlements} onChange={event => void saveTheme(event.target.value)}>{entitlements?.themes.map(theme => <option key={theme} value={theme}>{theme}</option>)}</select></label>{entitlements?.customTheme && <div className="grid grid-cols-2 gap-3"><label className="grid gap-2 text-sm">{t('appearance')}<input aria-label={`${t('customTheme')} ${t('appearance')}`} type="color" className="h-11 w-full" value={customTheme.background} onChange={event => setCustomTheme(current => ({ ...current, background: event.target.value }))} /></label><label className="grid gap-2 text-sm">{t('brandColor')}<input aria-label={`${t('customTheme')} ${t('brandColor')}`} type="color" className="h-11 w-full" value={customTheme.accent} onChange={event => setCustomTheme(current => ({ ...current, accent: event.target.value }))} /></label><Button variant="outline" className="col-span-2" disabled={busy} onClick={() => void saveCustomTheme()}>{t('customTheme')}</Button></div>}{entitlements?.companyBrand && <div className="rounded-xl p-3 text-sm" style={{ borderInlineStart: `4px solid ${entitlements.companyBrand.brandColor || '#17352c'}` }}>{t('brandedTheme')}</div>}</div></Panel>
      <Panel title={t('accountChecklist')}><ul className="grid gap-2 text-sm"><li>{t('email')}: {user?.personalEmailStatus === 'verified' ? t('complete') : t('pending')}</li><li>{user?.accountType === 'student' ? t('university') : t('company')}: {user?.accountType === 'student' ? user?.universityEmailStatus : user?.workEmailStatus}</li></ul></Panel>
      <Panel title={t('dataRights')}><div className="grid gap-4 text-sm"><p className="text-muted-foreground">{t('exportDataHelp')}</p><Button variant="outline" disabled={busy} onClick={() => void exportData()}>{t('exportData')}</Button><p className="text-muted-foreground">{t('deleteAccountHelp')}</p><label className="grid gap-2">{t('deleteAccount')}<input className={inputClass} value={deleteConfirmation} onChange={event => setDeleteConfirmation(event.target.value)} autoComplete="off" /></label><Button variant="outline" disabled={busy || deleteConfirmation !== t('deleteConfirm')} onClick={() => void deleteAccount()}>{t('deleteAccount')}</Button></div></Panel>
    </div>
    <div className="mt-6 flex items-center gap-4"><Button className="min-h-11 px-6" disabled={busy || !form.name} onClick={() => void save()}>{busy ? t('saving') : t('save')}</Button>{message && <p role="status" className="text-sm">{message}</p>}</div>
  </main></ProductShell>
}
