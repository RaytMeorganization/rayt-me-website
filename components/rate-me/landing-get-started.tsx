'use client'

import { useCallback, useState } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/product/password-input'
import { formatMarketingUsd as formatUsd, USD_PER_EMPLOYEE_YEAR, USD_PRO_YEAR } from '@/lib/plan-pricing'
import { api, errorMessage } from '@/lib/api'
import { storeUrlForUserAgent } from '@/lib/store-links'
import { cn } from '@/lib/utils'

type Phase = 'account' | 'plan' | 'download'

const ctaPrimary =
  'bg-violet-600 text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.8)] hover:bg-violet-500'

export function LandingGetStarted() {
  const [phase, setPhase] = useState<Phase>('account')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'business'>('pro')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const scrollToPricing = useCallback(() => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  async function createAccount(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const normalized = email.trim().toLowerCase()
    try {
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: normalized,
          personalEmail: normalized,
          password,
          accountType: 'professional',
          jobTitle: 'Professional',
          company: 'Independent',
          industry: 'General',
          city: 'Doha',
          country: 'Qatar',
        }),
      })
      setPhase('plan')
      requestAnimationFrame(() => {
        scrollToPricing()
        document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    } catch (cause) {
      setError(errorMessage(cause, 'Unable to create account'))
    } finally {
      setBusy(false)
    }
  }

  function continueToStore() {
    const url = storeUrlForUserAgent(typeof navigator !== 'undefined' ? navigator.userAgent : '')
    window.location.href = url
  }

  return (
    <section id="get-started" className="scroll-mt-28 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card
          className={cn(
            'border-white/10 bg-slate-900/50 backdrop-blur-xl transition-all duration-500',
            phase !== 'account' && 'ring-1 ring-violet-500/30',
          )}
        >
          <CardHeader>
            <CardTitle className="font-brand text-2xl text-white">Create your RaytME card</CardTitle>
            <CardDescription>
              {phase === 'account'
                ? 'Sign up with your email — then choose a plan and open the app.'
                : phase === 'plan'
                  ? 'Pick a plan to continue. Membership checkout stays on the web.'
                  : 'Download the app and sign in with the same email.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {phase === 'account' ? (
              <form onSubmit={createAccount}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="gs-name">Full name</FieldLabel>
                    <Input
                      id="gs-name"
                      required
                      className="min-h-11 bg-input/30"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gs-email">Email</FieldLabel>
                    <Input
                      id="gs-email"
                      required
                      type="email"
                      autoComplete="email"
                      className="min-h-11 bg-input/30"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="gs-password">Password</FieldLabel>
                    <PasswordInput
                      id="gs-password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={setPassword}
                    />
                  </Field>
                  {error ? (
                    <p role="alert" className="text-sm text-destructive">{error}</p>
                  ) : null}
                  <Button type="submit" disabled={busy} className={cn('min-h-11 w-full', ctaPrimary)}>
                    {busy ? 'Creating…' : 'Create account'}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </FieldGroup>
              </form>
            ) : null}

            {phase === 'plan' ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { id: 'basic' as const, label: 'Basic', price: formatUsd(0) },
                    { id: 'pro' as const, label: 'Pro', price: formatUsd(USD_PRO_YEAR) },
                    {
                      id: 'business' as const,
                      label: 'Business',
                      price: formatUsd(USD_PER_EMPLOYEE_YEAR),
                    },
                  ] as const
                ).map(plan => (
                  <button
                    key={plan.id}
                    type="button"
                    className={cn(
                      'rounded-xl border px-4 py-4 text-left transition',
                      selectedPlan === plan.id
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20',
                    )}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <p className="text-xs font-semibold tracking-wider text-white/60">{plan.label}</p>
                    <p className="mt-1 font-serif text-xl text-white">{plan.price}</p>
                  </button>
                ))}
              </div>
            ) : null}

            {phase === 'plan' ? (
              <Button
                type="button"
                className={cn('min-h-11 w-full', ctaPrimary)}
                onClick={() => setPhase('download')}
              >
                Continue with {selectedPlan.toUpperCase()}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            ) : null}

            {phase === 'download' ? (
              <div className="space-y-4">
                <p className="text-sm text-white/70">
                  Open the RaytME app on your phone and sign in with <strong>{email}</strong>.
                  {selectedPlan !== 'basic'
                    ? ' Complete membership for your plan at raytme.me when you are ready.'
                    : ''}
                </p>
                <Button
                  type="button"
                  className={cn('min-h-11 w-full', buttonVariants({ className: ctaPrimary }))}
                  onClick={continueToStore}
                >
                  Get the app
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
