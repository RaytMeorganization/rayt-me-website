'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, ProductShell, inputClass } from '@/components/product/shell'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { User } from '@/lib/types'

export default function SettingsPage() {
  const { t } = useI18n()
  const { user, refresh } = useAuth()
  const [form, setForm] = useState<Partial<User>>({})
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => { if (user) setForm(user) }, 0)
    return () => window.clearTimeout(timer)
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
        university: form.university || null,
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

  const fields: [keyof User, string][] = user?.accountType === 'student'
    ? [['name', t('name')], ['bio', t('bio')], ['university', t('university')], ['city', t('city')], ['country', t('country')]]
    : [['name', t('name')], ['bio', t('bio')], ['jobTitle', t('jobTitle')], ['company', t('company')], ['city', t('city')], ['country', t('country')]]
  const privacy: [keyof User, string][] = [['profilePublic', t('publicProfile')], ['emailPublic', t('publicEmail')], ['phonePublic', t('publicPhone')], ['locationPublic', t('publicLocation')], ['companyPublic', t('publicCompany')]]

  return <ProductShell><main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
    <PageHeader eyebrow={t('account')} title={t('settings')} description={t('settingsIntro')} />
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><Panel title={t('profile')}><div className="grid gap-4 sm:grid-cols-2">{fields.map(([key, label]) => <label className="grid gap-2 text-sm" key={key}>{label}<input className={inputClass} value={String(form[key] ?? '')} onChange={e => set(key, e.target.value)} /></label>)}</div></Panel>
      <div className="grid gap-6"><Panel title={t('privacy')}><div className="grid gap-3">{privacy.map(([key, label]) => <label className="flex items-center justify-between gap-4 rounded-xl bg-[#f7f8f4] p-3 text-sm" key={key}>{label}<input type="checkbox" checked={Boolean(form[key])} onChange={e => set(key, e.target.checked)} /></label>)}</div></Panel></div>
      <Panel title={t('plan')}><p className="text-3xl font-semibold capitalize">{user?.tier}</p><p className="mt-2 text-sm text-muted-foreground">{user?.isVerified ? t('verifiedReputation') : t('verificationHelp')}</p></Panel>
      <Panel title={t('accountChecklist')}><ul className="grid gap-2 text-sm"><li>{t('email')}: {user?.personalEmailStatus === 'verified' ? t('complete') : t('pending')}</li><li>{user?.accountType === 'student' ? t('university') : t('company')}: {user?.accountType === 'student' ? user?.universityEmailStatus : user?.workEmailStatus}</li></ul></Panel>
    </div>
    <div className="mt-6 flex items-center gap-4"><Button className="min-h-11 px-6" disabled={busy || !form.name} onClick={() => void save()}>{busy ? t('saving') : t('save')}</Button>{message && <p role="status" className="text-sm">{message}</p>}</div>
  </main></ProductShell>
}
