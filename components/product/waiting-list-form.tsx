'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, errorMessage } from '@/lib/api'

export function WaitingListForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const card = await api<{ publicCode: string }>('/waiting-list', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      router.push(`/wait/${encodeURIComponent(card.publicCode)}`)
    } catch (cause) {
      setError(errorMessage(cause, 'Could not join the waiting list.'))
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid w-full max-w-md gap-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-white">
      <h1 className="font-serif text-3xl">Join the waiting list</h1>
      <p className="text-sm text-white/70">Get Started saves your place. Your card shows a waiting-list id, not a QR code.</p>
      <label className="grid gap-1 text-sm">
        Name
        <input required value={name} onChange={event => setName(event.target.value)} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        Email
        <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        Password
        <input required type="password" minLength={8} value={password} onChange={event => setPassword(event.target.value)} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2" />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button type="submit" disabled={busy} className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-black disabled:opacity-50">
        {busy ? 'Saving…' : 'Get my waiting-list card'}
      </button>
    </form>
  )
}
