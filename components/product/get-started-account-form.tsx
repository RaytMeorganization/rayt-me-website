'use client'

import { useState } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { PasswordInput } from '@/components/product/password-input'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'
import type { AccountType } from '@/lib/types'
import { cn } from '@/lib/utils'

const ctaPrimary =
  'bg-violet-600 text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.8)] hover:bg-violet-500'

/** Step 1 — same registration fields as mobile + web sign-up. */
export function GetStartedAccountForm({
  onCreated,
  tied,
  selectedSummary,
  onEditPlan,
}: {
  onCreated: () => void
  tied?: boolean
  selectedSummary?: string
  onEditPlan?: () => void
}) {
  const { t } = useI18n()
  const { refresh } = useAuth()
  const [accountType, setAccountType] = useState<AccountType>('professional')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const personalEmail = String(form.get('personalEmail') ?? '')
      .trim()
      .toLowerCase()
    const payload = {
      ...Object.fromEntries(form.entries()),
      email: personalEmail,
      personalEmail,
      accountType,
    }
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await refresh()
      onCreated()
    } catch (cause) {
      setError(errorMessage(cause, t('error')))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/80">
          {t('getStartedStep1')}
        </p>
        <CardTitle className="font-brand text-2xl text-white">{t('getStartedTitle')}</CardTitle>
        <CardDescription>{tied ? t('getStartedIntroTied') : t('getStartedIntro')}</CardDescription>
      </CardHeader>
      <CardContent>
        {tied && selectedSummary ? (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200/80">
                {t('getStartedSelectedPlan')}
              </p>
              <p className="mt-1 text-sm font-medium text-white">{selectedSummary}</p>
            </div>
            {onEditPlan ? (
              <Button type="button" variant="outline" className="min-h-10" onClick={onEditPlan}>
                {t('getStartedEditPlan')}
              </Button>
            ) : null}
          </div>
        ) : null}
        <form onSubmit={createAccount}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="gs-name">{t('name')}</FieldLabel>
              <Input
                id="gs-name"
                required
                name="name"
                className="min-h-11 bg-input/30"
                autoComplete="name"
              />
            </Field>
            <Field>
              <FieldLabel>{t('profile')}</FieldLabel>
              <ToggleGroup
                variant="outline"
                spacing={2}
                value={[accountType]}
                onValueChange={next => {
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
              <FieldLabel htmlFor="gs-personalEmail">{t('personalEmail')}</FieldLabel>
              <Input
                id="gs-personalEmail"
                required
                type="email"
                name="personalEmail"
                autoComplete="email"
                className="min-h-11 bg-input/30"
              />
            </Field>
            {accountType === 'professional' ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="gs-workEmail">{t('workEmail')}</FieldLabel>
                  <Input
                    id="gs-workEmail"
                    required
                    type="email"
                    name="workEmail"
                    autoComplete="work email"
                    className="min-h-11 bg-input/30"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gs-jobTitle">{t('jobTitle')}</FieldLabel>
                  <Input id="gs-jobTitle" required name="jobTitle" className="min-h-11 bg-input/30" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gs-company">{t('company')}</FieldLabel>
                  <Input id="gs-company" required name="company" className="min-h-11 bg-input/30" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gs-industry">{t('industry')}</FieldLabel>
                  <Input id="gs-industry" required name="industry" className="min-h-11 bg-input/30" />
                </Field>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="gs-universityEmail">{t('universityEmail')}</FieldLabel>
                  <Input
                    id="gs-universityEmail"
                    required
                    type="email"
                    name="universityEmail"
                    className="min-h-11 bg-input/30"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="gs-university">{t('university')}</FieldLabel>
                  <Input id="gs-university" required name="university" className="min-h-11 bg-input/30" />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="gs-fieldOfStudy">{t('fieldOfStudy')}</FieldLabel>
                  <Input
                    id="gs-fieldOfStudy"
                    required
                    name="fieldOfStudy"
                    className="min-h-11 bg-input/30"
                  />
                </Field>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="gs-city">{t('city')}</FieldLabel>
                <Input id="gs-city" required name="city" className="min-h-11 bg-input/30" />
              </Field>
              <Field>
                <FieldLabel htmlFor="gs-country">{t('country')}</FieldLabel>
                <Input
                  id="gs-country"
                  required
                  name="country"
                  defaultValue="Qatar"
                  className="min-h-11 bg-input/30"
                />
              </Field>
            </div>
            {accountType === 'professional' ? (
              <Field>
                <FieldLabel htmlFor="gs-phone">{t('phone')}</FieldLabel>
                <Input
                  id="gs-phone"
                  required
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  className="min-h-11 bg-input/30"
                />
              </Field>
            ) : null}
            <Field>
              <FieldLabel htmlFor="gs-password">{t('password')}</FieldLabel>
              <PasswordInput
                id="gs-password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={setPassword}
              />
            </Field>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={busy} className={cn('min-h-11 w-full', ctaPrimary)}>
              {busy ? t('loading') : t('getStartedCreateAccount')}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
