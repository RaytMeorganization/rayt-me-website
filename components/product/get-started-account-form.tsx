'use client'

import { useRouter } from 'next/navigation'
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
import { PasswordInput } from '@/components/product/password-input'
import { api, errorMessage } from '@/lib/api'
import { GET_STARTED_PLANS_PATH } from '@/lib/get-started-funnel'
import { cn } from '@/lib/utils'

const ctaPrimary =
  'bg-violet-600 text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.8)] hover:bg-violet-500'

/** Step 1 — same core fields as the mobile register card (name, email, password). */
export function GetStartedAccountForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

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
      router.push(GET_STARTED_PLANS_PATH)
    } catch (cause) {
      setError(errorMessage(cause, 'Unable to create account'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="font-brand text-2xl text-white">Create your RaytME card</CardTitle>
        <CardDescription>
          Sign up with your email — then choose a plan and open the app.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                autoComplete="name"
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
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={busy} className={cn('min-h-11 w-full', ctaPrimary)}>
              {busy ? 'Creating…' : 'Create account'}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
