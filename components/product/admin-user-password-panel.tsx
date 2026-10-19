'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/components/product/providers'

export function AdminUserPasswordPanel({
  busy,
  onSave,
}: {
  busy?: boolean
  onSave: (password: string) => void | Promise<void>
}) {
  const { t } = useI18n()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const mismatch = confirm.length > 0 && password !== confirm
  const tooShort = password.length > 0 && password.length < 8
  const canSave = password.length >= 8 && password === confirm && !busy

  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-muted/10 p-4">
      <p className="text-sm text-muted-foreground">{t('adminPasswordNotViewable')}</p>
      <Field>
        <FieldLabel className="text-xs">{t('newPassword')}</FieldLabel>
        <Input
          type="password"
          autoComplete="new-password"
          value={password}
          disabled={busy}
          onChange={event => setPassword(event.target.value)}
          className="bg-input/30"
        />
      </Field>
      <Field>
        <FieldLabel className="text-xs">{t('adminConfirmPassword')}</FieldLabel>
        <Input
          type="password"
          autoComplete="new-password"
          value={confirm}
          disabled={busy}
          onChange={event => setConfirm(event.target.value)}
          className="bg-input/30"
        />
        {mismatch ? <p className="text-xs text-destructive">{t('adminPasswordMismatch')}</p> : null}
        {tooShort ? <p className="text-xs text-destructive">{t('adminPasswordTooShort')}</p> : null}
      </Field>
      <Button
        type="button"
        size="sm"
        disabled={!canSave}
        onClick={() => {
          void onSave(password)
          setPassword('')
          setConfirm('')
        }}
      >
        {t('adminUpdatePassword')}
      </Button>
    </div>
  )
}
