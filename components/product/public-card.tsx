'use client'

import Link from 'next/link'
import { Check, Lock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoLockup } from '@/components/brand/logo-lockup'
import { LocaleButton } from '@/components/product/shell'
import { ScoreRing } from '@/components/product/score-ring'
import { useI18n } from '@/components/product/providers'
import { cardThemeBarColor } from '@/lib/card-theme'
import type { PublicProfile } from '@/lib/types'

export function PublicCard({ profile }: { profile: PublicProfile }) {
  const { t } = useI18n()
  const title = profile.jobTitle || profile.education?.fieldOfStudy
  const organization = profile.company || profile.education?.university
  const location = profile.location ? [profile.location.city, profile.location.country].filter(Boolean).join(', ') : null
  const initials = profile.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()

  return <main className="min-h-screen bg-[var(--rm-cream)] px-5 py-8 sm:py-12">
    <div className="mx-auto flex max-w-xl items-center justify-between"><Link href="/" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rm-gold)]/30"><LogoLockup size="sm" /></Link><LocaleButton /></div>
    <div className="mx-auto mt-10 max-w-xl">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-[.18em] text-[var(--rm-sage-deep)]">{t('publicPreview')}</p>
      <article className="overflow-hidden rounded-[20px] border border-[var(--rm-line)] bg-white shadow-[0_30px_90px_-45px_rgba(17,33,61,.35)]">
        <div className="h-[3px]" style={{ backgroundColor: cardThemeBarColor(profile.theme) }} />
        <div className="p-6 sm:p-9">
          <div className="flex items-start gap-4">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-16 shrink-0 rounded-[18px] object-cover" /> : <div className="grid size-16 shrink-0 place-items-center rounded-[18px] bg-[var(--rm-gold-tint)] font-serif text-xl font-semibold text-[var(--rm-navy)]">{initials}</div>}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-[var(--rm-navy)]">{profile.name}</h1>
                {profile.isVerified && <span aria-label={t('verifiedReputation')} className="grid size-5 place-items-center rounded-full bg-[var(--rm-sage)] text-white"><Check className="size-3" /></span>}
              </div>
              {title && <p className="mt-1 text-sm text-[var(--rm-muted)]">{title}{organization ? ` · ${organization}` : ''}</p>}
              {location && <p className="mt-3 flex items-center gap-1 text-xs text-[var(--rm-muted)]"><MapPin className="size-3" />{location}</p>}
            </div>
            <ScoreRing score={Number(profile.reputation.score)} verified={profile.isVerified} />
          </div>
          {profile.bio && <p className="mt-6 text-sm leading-6 text-[var(--rm-ink)]">{profile.bio}</p>}
          <p className="mt-6 text-xs text-[var(--rm-muted)]"><strong className="text-[var(--rm-navy)]">{profile.reputation.credibleRatingCount}</strong> {t('basedOn')}</p>
          <div className="grid gap-3 border-t border-[var(--rm-line)] py-6 text-sm">{profile.email && <a className="text-[var(--rm-gold-deep)] underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>}{profile.phone ? <a className="underline underline-offset-4" href={`tel:${profile.phone}`}>{profile.phone}</a> : <p className="flex items-center gap-2 text-[var(--rm-muted)]"><Lock className="size-4" />{t('requestPhone')}</p>}</div>
        </div>
      </article>
      <div className="mt-6 rounded-[20px] bg-[var(--rm-navy)] p-6 text-center text-white"><p className="font-semibold">{t('download')}</p><p className="mt-2 text-sm text-white/65">{t('appOnly')}</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Button nativeButton={false} render={<a href={process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/'} />} className="bg-white text-[var(--rm-navy)] hover:bg-[var(--rm-gold-tint)]">App Store</Button><Button nativeButton={false} render={<a href={process.env.NEXT_PUBLIC_PLAY_STORE_URL || 'https://play.google.com/store'} />} variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">Google Play</Button></div></div>
    </div>
  </main>
}
