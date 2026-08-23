'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ProductShell, Panel, inputClass } from '@/components/product/shell'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'

const statusKey = (value: string) => value === 'verified' ? 'complete' : 'pending'
type VerificationType = 'personalEmail' | 'workEmail' | 'universityEmail' | 'phone'

export default function VerifyPage() {
  const { t } = useI18n()
  const { user, refresh } = useAuth()
  const [type, setType] = useState<VerificationType>('personalEmail')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function requestCode() {
    setBusy(true); setMessage('')
    try {
      const result = await api<{ sent: boolean; type: VerificationType; devCode?: string }>('/verification/send', { method: 'POST', body: JSON.stringify({ type }) })
      if (result.devCode) {
        setCode(result.devCode)
        setMessage(`${t('developmentCode')}: ${result.devCode}`)
      } else setMessage(t('sendCode'))
    }
    catch (error) { setMessage(errorMessage(error, t('error'))) } finally { setBusy(false) }
  }
  async function confirm() {
    setBusy(true); setMessage('')
    try { await api('/verification/confirm', { method: 'POST', body: JSON.stringify({ type, code }) }); await refresh(); setMessage(t('complete')) }
    catch (error) { setMessage(errorMessage(error, t('error'))) } finally { setBusy(false) }
  }

  const checks = user?.accountType === 'student'
    ? [['personalEmail', user.personalEmailStatus], ['universityEmail', user.universityEmailStatus]]
    : [['workEmail', user?.workEmailStatus], ['personalEmail', user?.personalEmailStatus], ['phone', user?.phoneStatus]]

  return <ProductShell><main className="mx-auto max-w-4xl px-5 py-10 lg:px-8"><h1 className="text-4xl font-semibold tracking-tight">{t('verification')}</h1><p className="mt-3 text-muted-foreground">{t('verificationHelp')}</p>
    <div className="mt-8 grid gap-6 md:grid-cols-2"><Panel title={t('accountChecklist')}><ul className="space-y-3">{checks.map(([key, status]) => <li key={key} className="flex justify-between rounded-xl bg-[#f7f8f4] p-3 text-sm"><span>{String(key)}</span><strong>{t(statusKey(String(status)))}</strong></li>)}</ul></Panel>
      <Panel title={t('verification')}><div className="grid gap-4"><label className="grid gap-2 text-sm">{t('verification')}<select className={inputClass} value={type} onChange={e => setType(e.target.value as VerificationType)}>{checks.map(([key]) => <option value={key} key={key}>{t(key as VerificationType)}</option>)}</select></label><Button variant="outline" disabled={busy} onClick={() => void requestCode()}>{t('sendCode')}</Button><label className="grid gap-2 text-sm">{t('code')}<input className={inputClass} value={code} onChange={e => setCode(e.target.value)} inputMode="numeric" /></label><Button disabled={busy || !code} onClick={() => void confirm()}>{t('confirmCode')}</Button>{message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}</div></Panel></div>
  </main></ProductShell>
}
