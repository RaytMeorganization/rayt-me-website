'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocaleButton, inputClass } from '@/components/product/shell'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { AccountType } from '@/lib/types'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { t } = useI18n()
  const { refresh } = useAuth()
  const router = useRouter()
  const search = useSearchParams()
  const [accountType, setAccountType] = useState<AccountType>('professional')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true); setError('')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      await api(mode === 'sign-in' ? '/auth/login' : '/auth/register', {
        method: 'POST', body: JSON.stringify(payload),
      })
      const session = await refresh()
      const roleDestination = session?.role === 'admin'
        ? '/admin-dashboard'
        : session?.role === 'business'
          ? '/business-dashboard'
          : '/settings'
      router.replace(search.get('next') || (mode === 'sign-up' ? '/verify' : roleDestination))
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
    } finally { setBusy(false) }
  }

  const signUp = mode === 'sign-up'
  return <main className="min-h-screen bg-[#f7f8f4] px-5 py-10">
    <div className="mx-auto flex max-w-lg items-center justify-between"><Link href="/" className="flex items-center gap-2 font-semibold text-[#17352c]"><ShieldCheck className="text-emerald-700" />Rayt Me</Link><LocaleButton /></div>
    <form onSubmit={submit} className="mx-auto mt-12 max-w-lg rounded-[28px] border border-[#d9dfd9] bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-9">
      <h1 className="text-3xl font-semibold tracking-[-.04em]">{signUp ? t('signUp') : t('signIn')}</h1>
      <div className="mt-8 grid gap-5">
        {signUp && <><label className="grid gap-2 text-sm">{t('name')}<input required name="name" autoComplete="name" className={inputClass} /></label>
          <fieldset><legend className="mb-2 text-sm">{t('profile')}</legend><div className="grid grid-cols-2 gap-2">{(['professional','student'] as const).map(type => <label key={type} className={`cursor-pointer rounded-xl border p-3 text-sm ${accountType === type ? 'border-emerald-700 bg-emerald-50' : 'border-[#d9dfd9]'}`}><input className="sr-only" type="radio" name="accountType" value={type} checked={accountType === type} onChange={() => setAccountType(type)} />{t(type)}</label>)}</div></fieldset>
          <label className="grid gap-2 text-sm">{t('personalEmail')}<input required type="email" name="personalEmail" autoComplete="email" className={inputClass} /></label>
          {accountType === 'professional' ? <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('workEmail')}<input required type="email" name="workEmail" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('jobTitle')}<input required name="jobTitle" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('company')}<input required name="company" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('industry')}<input required name="industry" className={inputClass} /></label></div> : <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('universityEmail')}<input required type="email" name="universityEmail" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('university')}<input required name="university" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('fieldOfStudy')}<input required name="fieldOfStudy" className={inputClass} /></label></div>}
          <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('city')}<input required name="city" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('country')}<input required name="country" className={inputClass} /></label></div></>}
        <label className="grid gap-2 text-sm">{t('email')}<input required type="email" name="email" autoComplete="email" className={inputClass} /></label>
        {signUp && accountType === 'professional' && <label className="grid gap-2 text-sm">{t('phone')}<input required type="tel" name="phone" autoComplete="tel" className={inputClass} /></label>}
        <label className="grid gap-2 text-sm">{t('password')}<input required minLength={8} type="password" name="password" autoComplete={signUp ? 'new-password' : 'current-password'} className={inputClass} /></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button disabled={busy} className="min-h-11 rounded-xl bg-[#17352c]">{busy ? t('loading') : t('continue')}</Button>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground"><Link className="font-semibold text-emerald-800 underline" href={signUp ? '/sign-in' : '/sign-up'}>{signUp ? t('signIn') : t('signUp')}</Link></p>
    </form>
  </main>
}
