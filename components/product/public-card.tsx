'use client'

import { Check, Lock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MarketingShell } from '@/components/product/marketing-shell'
import { ScoreRing } from '@/components/product/score-ring'
import { useI18n } from '@/components/product/providers'
import { cardThemeBarColor } from '@/lib/card-theme'
import type { PublicProfile } from '@/lib/types'

export function PublicCard({ profile }: { profile: PublicProfile }) {
  const { t } = useI18n()
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
        <Card className="overflow-hidden border-white/10 bg-card/95 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <div className="h-[3px]" style={{ backgroundColor: cardThemeBarColor(profile.theme) }} />
          <CardContent className="p-6 sm:p-9">
            <div className="flex items-start gap-4">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="size-16 shrink-0 rounded-[18px] object-cover" />
              ) : (
                <div className="grid size-16 shrink-0 place-items-center rounded-[18px] bg-accent font-serif text-xl font-semibold text-foreground">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground">{profile.name}</h1>
                  {profile.isVerified ? (
                    <span
                      aria-label={t('verifiedReputation')}
                      className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground"
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
              <ScoreRing score={Number(profile.reputation.score)} verified={profile.isVerified} />
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
              ) : (
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Lock data-icon="inline-start" />
                  {t('requestPhone')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="mt-6 border-white/10 bg-card/80 p-6 text-center backdrop-blur-xl">
          <p className="font-semibold text-foreground">{t('download')}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t('appOnly')}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button
              nativeButton={false}
              render={<a href={process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/'} />}
            >
              App Store
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              render={<a href={process.env.NEXT_PUBLIC_PLAY_STORE_URL || 'https://play.google.com/store'} />}
            >
              Google Play
            </Button>
          </div>
        </Card>
      </div>
    </MarketingShell>
  )
}
