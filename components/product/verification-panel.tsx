'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Panel, inputClass } from '@/components/product/shell'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, errorMessage } from '@/lib/api'

const statusKey = (value: string) => (value === 'verified' ? 'complete' : 'pending')

export type VerificationType = 'personalEmail' | 'workEmail' | 'universityEmail' | 'phone'

export function VerificationPanel({ showChecklist = true }: { showChecklist?: boolean }) {
  const { t } = useI18n()
  const { user, refresh } = useAuth()
  const [type, setType] = useState<VerificationType>('personalEmail')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const checks: [VerificationType, string | undefined][] = user?.accountType === 'student'
    ? [['personalEmail', user.personalEmailStatus], ['universityEmail', user.universityEmailStatus]]
    : [
        ['personalEmail', user?.personalEmailStatus],
        ['workEmail', user?.workEmailStatus],
        ['phone', user?.phoneStatus],
      ]

  async function requestCode() {
    setBusy(true)
    setMessage('')
    try {
      const result = await api<{ sent: boolean; type: VerificationType; devCode?: string }>('/verification/send', {
        method: 'POST',
        body: JSON.stringify({ type }),
      })
      if (result.devCode) {
        setCode(result.devCode)
        setMessage(`${t('developmentCode')}: ${result.devCode}`)
      } else setMessage(t('sendCode'))
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function confirm() {
    setBusy(true)
    setMessage('')
    try {
      await api('/verification/confirm', { method: 'POST', body: JSON.stringify({ type, code }) })
      await refresh()
      setMessage(t('complete'))
    } catch (error) {
      setMessage(errorMessage(error, t('error')))
    } finally {
      setBusy(false)
    }
  }

  if (!user) return null

  const pendingTypes = checks.filter(([, status]) => status !== 'verified').map(([key]) => key)
  const activeType = pendingTypes.includes(type) ? type : (pendingTypes[0] ?? type)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {showChecklist ? (
        <Panel title={t('accountChecklist')}>
          <ul className="space-y-3">
            {checks.map(([key, status]) => (
              <li key={key} className="flex justify-between gap-3 rounded-xl bg-muted/50 p-3 text-sm">
                <span className="text-foreground">{t(key)}</span>
                <strong className="text-muted-foreground">{t(statusKey(String(status ?? 'pending')))}</strong>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
      <Panel title={t('verification')}>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm">
            {t('verification')}
            <select
              className={inputClass}
              value={activeType}
              onChange={e => setType(e.target.value as VerificationType)}
            >
              {checks.map(([key]) => (
                <option value={key} key={key}>{t(key)}</option>
              ))}
            </select>
          </label>
          <Button variant="outline" disabled={busy} onClick={() => void requestCode()}>{t('sendCode')}</Button>
          <label className="grid gap-2 text-sm">
            {t('code')}
            <input
              className={inputClass}
              value={code}
              onChange={e => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </label>
          <Button disabled={busy || !code} onClick={() => void confirm()}>{t('confirmCode')}</Button>
          {message ? <p role="status" className="text-sm text-muted-foreground">{message}</p> : null}
        </div>
      </Panel>
    </div>
  )
}
