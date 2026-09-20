'use client'

import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { inputClass } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'

export type DbRole = 'USER' | 'BUSINESS_ADMIN' | 'PLATFORM_ADMIN'

export function normalizeDbRole(role: unknown): DbRole {
  const value = String(role ?? 'USER')
  if (value === 'business') return 'BUSINESS_ADMIN'
  if (value === 'admin') return 'PLATFORM_ADMIN'
  if (value === 'USER' || value === 'BUSINESS_ADMIN' || value === 'PLATFORM_ADMIN') return value
  return 'USER'
}

function initials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function accentForRole(role: DbRole) {
  switch (role) {
    case 'PLATFORM_ADMIN':
      return '#AD8547'
    case 'BUSINESS_ADMIN':
      return '#2E6B4C'
    default:
      return '#11213D'
  }
}

export function roleLabel(role: DbRole, t: ReturnType<typeof useI18n>['t']) {
  switch (role) {
    case 'PLATFORM_ADMIN':
      return t('adminRole')
    case 'BUSINESS_ADMIN':
      return t('businessRole')
    default:
      return t('userRole')
  }
}

export function AdminUserCard({
  name,
  email,
  role,
  isVerified,
  isActive,
  createdAt,
  jobTitle,
  company,
  city,
  country,
  tier,
  accountType,
  profileId,
  busy,
  onRoleChange,
  onToggleActive,
}: {
  name: string
  email: string
  role: DbRole
  isVerified: boolean
  isActive: boolean
  createdAt?: string
  jobTitle?: string | null
  company?: string | null
  city?: string | null
  country?: string | null
  tier?: string | null
  accountType?: string | null
  profileId?: string
  busy?: boolean
  onRoleChange: (role: DbRole) => void
  onToggleActive: () => void
}) {
  const { t } = useI18n()
  const joined = createdAt ? new Date(createdAt).toLocaleDateString() : null

  return (
    <Card className="overflow-hidden border-white/10 bg-card/90 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-white/20">
      <div className="h-[3px]" style={{ backgroundColor: accentForRole(role) }} />
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div
            className="grid size-14 shrink-0 place-items-center rounded-[16px] bg-accent font-serif text-lg font-semibold text-foreground"
            aria-hidden
          >
            {initials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-serif text-lg font-semibold tracking-tight text-foreground">{name}</h3>
              {isVerified ? (
                <span
                  className="grid size-5 place-items-center rounded-full bg-emerald-700 text-white"
                  aria-label={t('verifiedReputation')}
                >
                  <Check className="size-3" />
                </span>
              ) : null}
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">{email}</p>
            {jobTitle || company ? (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {[jobTitle, company].filter(Boolean).join(' · ')}
              </p>
            ) : null}
            {city || country ? (
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {[city, country].filter(Boolean).join(', ')}
              </p>
            ) : null}
            {joined ? (
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {joined}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="default" className="rounded-full px-2.5">
                {roleLabel(role, t)}
              </Badge>
              <Badge variant={isVerified ? 'secondary' : 'outline'} className="rounded-full px-2.5">
                {isVerified ? t('complete') : t('pending')}
              </Badge>
              <Badge variant={isActive ? 'secondary' : 'destructive'} className="rounded-full px-2.5">
                {isActive ? t('activate') : t('deactivate')}
              </Badge>
              {tier ? (
                <Badge variant="outline" className="rounded-full px-2.5">
                  {tier === 'pro' ? t('tierPro') : tier === 'business' ? t('tierBusiness') : t('tierBasic')}
                </Badge>
              ) : null}
              {accountType === 'student' ? (
                <Badge variant="outline" className="rounded-full px-2.5">
                  {t('student')}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
      <Separator className="bg-white/10" />
      <CardFooter className="flex flex-col gap-3 border-0 bg-muted/15 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <Field className="w-full min-w-0 flex-1 sm:max-w-[14rem]">
          <FieldLabel className="text-xs">{t('role')}</FieldLabel>
          <select
            className={inputClass}
            value={role}
            disabled={busy}
            onChange={event => onRoleChange(event.target.value as DbRole)}
          >
            <option value="USER">{t('userRole')}</option>
            <option value="BUSINESS_ADMIN">{t('businessRole')}</option>
            <option value="PLATFORM_ADMIN">{t('adminRole')}</option>
          </select>
        </Field>
        <Button
          size="sm"
          variant="outline"
          className="w-full shrink-0 sm:w-auto"
          disabled={busy}
          onClick={onToggleActive}
        >
          {isActive ? t('deactivate') : t('activate')}
        </Button>
        {profileId ? (
          <Button
            nativeButton={false}
            size="sm"
            variant="ghost"
            className="w-full shrink-0 sm:w-auto"
            render={<a href={`/p/${encodeURIComponent(profileId)}`} />}
          >
            {t('viewPublicCard')}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
