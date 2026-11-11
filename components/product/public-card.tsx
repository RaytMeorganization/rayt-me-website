'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Check, Lock, MapPin } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MarketingShell } from '@/components/product/marketing-shell'
import { ScoreRing } from '@/components/product/score-ring'
import { useAuth, useI18n } from '@/components/product/providers'
import { cardThemeSurface } from '@/lib/card-theme'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/store-links'
import type { PublicProfile } from '@/lib/types'

export function PublicCard({ profile }: { profile: PublicProfile }) {
  const { t } = useI18n()
  const { user } = useAuth()
  const [logoFailed, setLogoFailed] = useState(false)
  const isOwner = Boolean(user?.id && user.id === profile.id)
  const surface = cardThemeSurface(profile.theme)
  const title = profile.jobTitle || profile.education?.fieldOfStudy
  const organization = profile.company || profile.education?.university
  const location = profile.location
    ? [profile.location.city, profile.location.country].filter(Boolean).join(', ')
    : null
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <MarketingShell>
      <div className="mx-auto max-w-xl px-5 py-10 sm:py-14">
        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {t('publicPreview')}
        </p>
        <Card
          className="relative overflow-hidden border-white/10 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          style={{ backgroundColor: surface.background }}
        >
          <div className="h-[3px]" style={{ backgroundColor: surface.accent }} />
          {surface.artUrl ? (
            <>
              <Image
                src={surface.artUrl}
                alt=""
                width={320}
                height={220}
                unoptimized
                className="pointer-events-none absolute inset-y-0 end-0 h-full w-[52%] object-cover object-right opacity-95"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${surface.background} 0%, ${surface.background} 36%, transparent 78%)`,
                }}
              />
            </>
          ) : null}
          <CardContent className="relative p-6 sm:p-9">
            <div className="flex items-start gap-4">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="" width={64} height={64} unoptimized className="size-16 shrink-0 rounded-[18px] object-cover" />
              ) : (
                <div className="grid size-16 shrink-0 place-items-center rounded-[18px] bg-accent font-serif text-xl font-semibold text-foreground">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-semibold tracking-tight" style={{ color: surface.light ? '#11213D' : '#FFFFFF' }}>{profile.name}</h1>
                  {profile.isVerified ? (
                    <span
                      aria-label={t('verifiedReputation')}
                      className="grid size-5 place-items-center rounded-full bg-emerald-700 text-white"
                    >
                      <Check data-icon="inline-start" />
                    </span>
                  ) : null}
                </div>
                {title ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {title}
                    {organization ? ` · ${organization}` : ''}
                  </p>
                ) : null}
                {location ? (
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin data-icon="inline-start" />
                    {location}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <ScoreRing
                  score={Number(profile.reputation.score)}
                  verified={profile.isVerified}
                  textColor={surface.light ? '#11213D' : '#FFFFFF'}
                  verifiedLabel={t('verified')}
                  ariaLabel={t(profile.isVerified ? 'scoreOutOf5Verified' : 'scoreOutOf5').replace('{score}', Math.max(0, Math.min(5, Number(profile.reputation.score) || 0)).toFixed(1))}
                />
                {/* Hide the theme logo if it fails to load instead of showing a broken-image "?" icon. */}
                {surface.logoUrl && !logoFailed ? (
                  <Image src={surface.logoUrl} alt="" width={40} height={40} unoptimized onError={() => setLogoFailed(true)} className="size-10 rounded-xl object-contain" />
                ) : null}
              </div>
            </div>
            {profile.bio ? <p className="mt-6 text-sm leading-6 text-foreground/90">{profile.bio}</p> : null}
            <p className="mt-6 text-xs text-muted-foreground">
              <strong className="text-foreground">{profile.reputation.credibleRatingCount}</strong> {t('basedOn')}
            </p>
            <div className="grid gap-3 border-t border-white/10 py-6 text-sm">
              {profile.email ? (
                <a className="text-primary underline underline-offset-4" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              ) : null}
              {profile.phone ? (
                <a className="underline underline-offset-4" href={`tel:${profile.phone}`}>{profile.phone}</a>
              ) : profile.phonePrivate ? (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Lock data-icon="inline-start" />
                  {t('requestPhone')}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6 border-white/10 bg-card/80 p-6 text-center backdrop-blur-xl">
          <p className="font-semibold text-foreground">{t('download')}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('appOnly').replace('{name}', profile.name)}
          </p>
          {!isOwner ? (
            <div className="mt-5">
              <Link
                className={buttonVariants({ className: 'min-h-11 rounded-full px-6' })}
                href={`/p/${encodeURIComponent(profile.id)}/rate`}
              >
                {t('webRateCta').replace('{name}', profile.name)}
              </Link>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a className={buttonVariants()} href={APP_STORE_URL}>
              App Store
            </a>
            <a className={buttonVariants({ variant: 'outline' })} href={PLAY_STORE_URL}>
              Google Play
            </a>
          </div>
        </Card>
      </div>
    </MarketingShell>
  )
}
