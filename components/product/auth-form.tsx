'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MarketingShell } from '@/components/product/marketing-shell'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import { WEB_SIGN_IN_DISABLED, WEB_SIGN_UP_DISABLED } from '@/lib/web-sign-in'
import type { AccountType, Role } from '@/lib/types'

const homeFor = (role?: Role) =>
  role === 'admin' ? '/admin-dashboard' : role === 'business' ? '/business-dashboard' : '/settings'

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
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      await api(mode === 'sign-in' ? '/auth/login' : '/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      const session = await refresh()
      const fallback = mode === 'sign-up' ? '/verify' : homeFor(session?.role)
      router.replace(safeNext(search.get('next'), session?.role) ?? fallback)
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  const signUp = mode === 'sign-up'

  return (
    <MarketingShell hideAuthLinks>
      <div className="mx-auto max-w-lg px-5 py-10 sm:py-14">
        <Card className="border-white/10 bg-card/90 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {signUp ? t('signUp') : t('signIn')}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {signUp ? t('signUpIntro') : t('signInRequiredHelp')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="auth-form" onSubmit={submit}>
              <FieldGroup>
                {signUp ? (
                  <>
                    <Field>
                      <FieldLabel htmlFor="name">{t('name')}</FieldLabel>
                      <Input id="name" required name="name" autoComplete="name" className="min-h-11" />
                    </Field>
                    <Field>
                      <FieldLabel>{t('profile')}</FieldLabel>
                      <input type="hidden" name="accountType" value={accountType} />
                      <ToggleGroup
                        variant="outline"
                        spacing={2}
                        value={[accountType]}
                        onValueChange={(next) => {
                          const selected = Array.isArray(next) ? next[0] : next
                          if (selected === 'professional' || selected === 'student') {
                            setAccountType(selected)
                          }
                        }}
                        className="grid w-full grid-cols-2"
                      >
                        <ToggleGroupItem value="professional" className="min-h-11 justify-center rounded-xl">
                          {t('professional')}
                        </ToggleGroupItem>
                        <ToggleGroupItem value="student" className="min-h-11 justify-center rounded-xl">
                          {t('student')}
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="personalEmail">{t('personalEmail')}</FieldLabel>
                      <Input
                        id="personalEmail"
                        required
                        type="email"
                        name="personalEmail"
                        autoComplete="email"
                        className="min-h-11"
                      />
                    </Field>
                    {accountType === 'professional' ? (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor="workEmail">{t('workEmail')}</FieldLabel>
                          <Input id="workEmail" required type="email" name="workEmail" className="min-h-11" />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="jobTitle">{t('jobTitle')}</FieldLabel>
                          <Input id="jobTitle" required name="jobTitle" className="min-h-11" />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="company">{t('company')}</FieldLabel>
                          <Input id="company" required name="company" className="min-h-11" />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="industry">{t('industry')}</FieldLabel>
                          <Input id="industry" required name="industry" className="min-h-11" />
                        </Field>
                      </div>
                    ) : (
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor="universityEmail">{t('universityEmail')}</FieldLabel>
                          <Input
                            id="universityEmail"
                            required
                            type="email"
                            name="universityEmail"
                            className="min-h-11"
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="university">{t('university')}</FieldLabel>
                          <Input id="university" required name="university" className="min-h-11" />
                        </Field>
                        <Field className="sm:col-span-2">
                          <FieldLabel htmlFor="fieldOfStudy">{t('fieldOfStudy')}</FieldLabel>
                          <Input id="fieldOfStudy" required name="fieldOfStudy" className="min-h-11" />
                        </Field>
                      </div>
                    )}
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="city">{t('city')}</FieldLabel>
                        <Input id="city" required name="city" className="min-h-11" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="country">{t('country')}</FieldLabel>
                        <Input id="country" required name="country" className="min-h-11" />
                      </Field>
                    </div>
                  </>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
                  <Input
                    id="email"
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="min-h-11"
                  />
                </Field>
                {signUp && accountType === 'professional' ? (
                  <Field>
                    <FieldLabel htmlFor="phone">{t('phone')}</FieldLabel>
                    <Input id="phone" required type="tel" name="phone" autoComplete="tel" className="min-h-11" />
                  </Field>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
                  <Input
                    id="password"
                    required
                    minLength={8}
                    type="password"
                    name="password"
                    autoComplete={signUp ? 'new-password' : 'current-password'}
                    className="min-h-11"
                  />
                </Field>
                {error ? (
                  <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" disabled={busy} className="min-h-11 w-full">
                  {busy ? t('loading') : t('continue')}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
          {signUp && WEB_SIGN_IN_DISABLED ? (
            <CardFooter className="justify-center border-t border-white/10 bg-transparent">
              <p className="text-center text-sm text-muted-foreground">
                <span className="font-medium opacity-40">{t('signIn')}</span>
              </p>
            </CardFooter>
          ) : !signUp && WEB_SIGN_UP_DISABLED ? null : (
            <CardFooter className="justify-center border-t border-white/10 bg-transparent">
              <p className="text-center text-sm text-muted-foreground">
                <Link className="font-semibold text-primary underline underline-offset-4" href={signUp ? '/sign-in' : '/sign-up'}>
                  {signUp ? t('signIn') : t('signUp')}
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </MarketingShell>
  )
}
