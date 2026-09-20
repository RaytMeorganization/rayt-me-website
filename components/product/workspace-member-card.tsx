'use client'

import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScoreRing } from '@/components/product/score-ring'
import { inputClass } from '@/components/product/shell'
import { cardThemeBarColor } from '@/lib/card-theme'
import { useI18n } from '@/components/product/providers'

export type WorkspaceMemberCardProps = {
  name: string
  email: string
  jobTitle?: string | null
  company?: string | null
  city?: string | null
  country?: string | null
  score?: number | null
  ratingsCount?: number | null
  isVerified?: boolean
  avatarUrl?: string | null
  employmentStatus?: 'working' | 'not_working' | 'open_to_work' | null
  role: string
  accentColor?: string | null
  profileHref?: string | null
  canRemove?: boolean
  canChangeRole?: boolean
  busy?: boolean
  onRemove?: () => void
  onRoleChange?: (role: 'MEMBER' | 'ADMIN') => void
}

function initials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function WorkspaceMemberCard({
  name,
  email,
  jobTitle,
  company,
  city,
  country,
  score,
  ratingsCount,
  isVerified = false,
  avatarUrl,
  employmentStatus,
  role,
  accentColor,
  profileHref,
  canRemove = false,
  canChangeRole = false,
  busy = false,
  onRemove,
  onRoleChange,
}: WorkspaceMemberCardProps) {
  const { t } = useI18n()
  const bar = cardThemeBarColor(accentColor ?? 'forest')
  const roleLabel = role === 'ADMIN' ? t('organizationAdminRole') : t('memberRole')
  const ring =
    employmentStatus === 'working'
      ? '#22C55E'
      : employmentStatus === 'not_working'
        ? '#EF4444'
        : employmentStatus === 'open_to_work'
          ? '#3B82F6'
          : '#9CA3AF'
  const statusLabel =
    employmentStatus === 'working'
      ? t('statusWorking')
      : employmentStatus === 'not_working'
        ? t('statusNotWorking')
        : employmentStatus === 'open_to_work'
          ? t('statusOpenToWork')
          : null

  return (
    <Card className="group overflow-hidden border-white/10 bg-card/90 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-white/20">
      <div className="h-[3px]" style={{ backgroundColor: bar }} />
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div
            className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[16px] bg-accent font-serif text-lg font-semibold text-foreground"
            style={{ boxShadow: `0 0 0 3px ${ring}` }}
            aria-hidden
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              initials(name)
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
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
                {jobTitle ? <p className="mt-0.5 truncate text-sm text-muted-foreground">{jobTitle}</p> : null}
                {company ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{company}</p> : null}
                {city || country ? (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {[city, country].filter(Boolean).join(', ')}
                  </p>
                ) : null}
                {statusLabel ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{statusLabel}</p> : null}
                <p className="mt-1 truncate text-xs text-muted-foreground">{email}</p>
              </div>
              {canRemove && onRemove ? (
                <Button size="sm" variant="outline" className="shrink-0" disabled={busy} onClick={onRemove}>
                  {t('remove')}
                </Button>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {canChangeRole && onRoleChange ? (
                <select
                  aria-label={t('role')}
                  className={`${inputClass} max-w-[11rem] text-xs`}
                  value={role}
                  disabled={busy}
                  onChange={event => onRoleChange(event.target.value as 'MEMBER' | 'ADMIN')}
                >
                  <option value="MEMBER">{t('memberRole')}</option>
                  <option value="ADMIN">{t('organizationAdminRole')}</option>
                </select>
              ) : (
                <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'} className="rounded-full px-2.5">
                  {roleLabel}
                </Badge>
              )}
              <ScoreRing score={Number(score ?? 0)} verified={isVerified} size={52} />
            </div>
            {ratingsCount != null ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {ratingsCount} {t('basedOn')}
              </p>
            ) : null}
            {profileHref ? (
              <Button
                nativeButton={false}
                size="sm"
                variant="ghost"
                className="mt-3 px-0"
                render={<a href={profileHref} />}
              >
                {t('viewPublicCard')}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
