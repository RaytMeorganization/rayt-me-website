'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogoLockup } from '@/components/brand/logo-lockup'
import { LocaleButton, inputClass } from '@/components/product/shell'
import { Backdrop } from '@/components/product/brand-art'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { AccountType, Role } from '@/lib/types'

const homeFor = (role?: Role) => role === 'admin' ? '/admin-dashboard' : role === 'business' ? '/business-dashboard' : '/settings'

/** `next` is caller-supplied: keep it same-origin and within the role's reach. */
function safeNext(next: string | null, role?: Role) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return null
  if (next.startsWith('/admin-dashboard')) return role === 'admin' ? next : null
  if (next.startsWith('/business-dashboard')) return role === 'business' ? next : null
  return next
}

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
      const fallback = mode === 'sign-up' ? '/verify' : homeFor(session?.role)
      router.replace(safeNext(search.get('next'), session?.role) ?? fallback)
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
    } finally { setBusy(false) }
  }

  const signUp = mode === 'sign-up'
  return <main className="relative min-h-screen px-5 py-10 text-[#11213D]">
    <Backdrop />
    <div className="relative z-10 mx-auto flex max-w-lg items-center justify-between"><Link href="/" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AD8547]/30"><LogoLockup size="sm" /></Link><LocaleButton /></div>
    <form onSubmit={submit} className="relative z-10 mx-auto mt-12 max-w-lg rounded-[28px] border border-[#eae2d1] bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-9">
      <h1 className="font-serif text-3xl font-semibold tracking-[-.02em] text-[#11213D]">{signUp ? t('signUp') : t('signIn')}</h1>
      <p className="mt-2 text-sm text-[#5c6b64]">{signUp ? t('signUpIntro') : t('signInRequiredHelp')}</p>
      <div className="mt-8 grid gap-5">
        {signUp && <><label className="grid gap-2 text-sm">{t('name')}<input required name="name" autoComplete="name" className={inputClass} /></label>
          <fieldset><legend className="mb-2 text-sm">{t('profile')}</legend><div className="grid grid-cols-2 gap-2">{(['professional','student'] as const).map(type => <label key={type} className={`cursor-pointer rounded-[18px] border-2 p-3 text-sm ${accountType === type ? (type === 'professional' ? 'border-[#AD8547] bg-[#F4E9D3]' : 'border-[#2E6B4C] bg-[#E1EEE6]') : 'border-[#eae2d1]'}`}><input className="sr-only" type="radio" name="accountType" value={type} checked={accountType === type} onChange={() => setAccountType(type)} />{t(type)}</label>)}</div></fieldset>
          <label className="grid gap-2 text-sm">{t('personalEmail')}<input required type="email" name="personalEmail" autoComplete="email" className={inputClass} /></label>
          {accountType === 'professional' ? <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('workEmail')}<input required type="email" name="workEmail" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('jobTitle')}<input required name="jobTitle" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('company')}<input required name="company" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('industry')}<input required name="industry" className={inputClass} /></label></div> : <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('universityEmail')}<input required type="email" name="universityEmail" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('university')}<input required name="university" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('fieldOfStudy')}<input required name="fieldOfStudy" className={inputClass} /></label></div>}
          <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm">{t('city')}<input required name="city" className={inputClass} /></label><label className="grid gap-2 text-sm">{t('country')}<input required name="country" className={inputClass} /></label></div></>}
        <label className="grid gap-2 text-sm">{t('email')}<input required type="email" name="email" autoComplete="email" className={inputClass} /></label>
        {signUp && accountType === 'professional' && <label className="grid gap-2 text-sm">{t('phone')}<input required type="tel" name="phone" autoComplete="tel" className={inputClass} /></label>}
        <label className="grid gap-2 text-sm">{t('password')}<input required minLength={8} type="password" name="password" autoComplete={signUp ? 'new-password' : 'current-password'} className={inputClass} /></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={busy} className="min-h-11 rounded-xl bg-[#11213D]">{busy ? t('loading') : t('continue')}</Button>
      </div>
      <p className="mt-6 text-center text-sm text-[#6e7480]"><Link className="font-semibold text-[#8C6B37] underline" href={signUp ? '/sign-in' : '/sign-up'}>{signUp ? t('signIn') : t('signUp')}</Link></p>
    </form>
  </main>
}
