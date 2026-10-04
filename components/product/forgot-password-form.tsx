'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { MarketingShell } from '@/components/product/marketing-shell'
import { PasswordInput } from '@/components/product/password-input'
import { useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'

type Step = 'email' | 'reset'

export function ForgotPasswordForm() {
  const { t } = useI18n()
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')

  async function requestCode(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setHint('')
    try {
      const result = await api<{ sent: boolean; devCode?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (result.devCode) {
        setHint(t('forgotPasswordDevCode').replace('{code}', result.devCode))
      }
      setStep('reset')
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function completeReset(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await api('/auth/forgot-password/complete', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: code.trim(),
          password,
        }),
      })
      router.replace('/sign-in?reset=1')
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  return (
    <MarketingShell hideAuthLinks>
      <div className="mx-auto max-w-lg px-5 py-10 sm:py-14">
        <Card className="border-white/10 bg-card/90 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {t('forgotPassword')}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              {step === 'email' ? t('forgotPasswordIntro') : t('forgotPasswordOtpIntro')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={requestCode}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-email">{t('email')}</FieldLabel>
                    <Input
                      id="reset-email"
                      required
                      type="email"
                      autoComplete="email"
                      className="min-h-11"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Field>
                  {error ? (
                    <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </p>
                  ) : null}
                  <Button type="submit" disabled={busy} className="min-h-11 w-full">
                    {busy ? t('loading') : t('sendResetCode')}
                  </Button>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={completeReset}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>{t('email')}</FieldLabel>
                    <Input readOnly className="min-h-11 bg-muted/30" value={email} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reset-code">{t('verificationCode')}</FieldLabel>
                    <Input
                      id="reset-code"
                      required
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      className="min-h-11 tracking-[0.35em]"
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reset-password">{t('newPassword')}</FieldLabel>
                    <PasswordInput
                      id="reset-password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={setPassword}
                    />
                  </Field>
                  {hint ? (
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  ) : null}
                  {error ? (
                    <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </p>
                  ) : null}
                  <Button type="submit" disabled={busy} className="min-h-11 w-full">
                    {busy ? t('loading') : t('saveNewPassword')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={busy}
                    className="min-h-11 w-full"
                    onClick={() => {
                      setStep('email')
                      setCode('')
                      setPassword('')
                      setError('')
                    }}
                  >
                    {t('useDifferentEmail')}
                  </Button>
                </FieldGroup>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t border-white/10 bg-transparent">
            <Link className="text-sm font-semibold text-primary underline underline-offset-4" href="/sign-in">
              {t('signIn')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </MarketingShell>
  )
}
