'use client'

import Link from 'next/link'
import { Check, Lock, MapPin, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocaleButton } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'
import type { PublicProfile } from '@/lib/types'

export function PublicCard({ profile }: { profile: PublicProfile }) {
  const { t } = useI18n()
  const title = profile.jobTitle || profile.education?.fieldOfStudy
  const organization = profile.company || profile.education?.university
  const location = profile.location ? [profile.location.city, profile.location.country].filter(Boolean).join(', ') : null
  const initials = profile.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()

  return <main className="min-h-screen bg-[#f3f5f0] px-5 py-8 sm:py-12">
    <div className="mx-auto flex max-w-xl items-center justify-between"><Link href="/" className="flex items-center gap-2 font-semibold text-[#17352c]"><ShieldCheck className="text-emerald-700" />Rayt Me</Link><LocaleButton /></div>
    <div className="mx-auto mt-10 max-w-xl">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-[.18em] text-emerald-800">{t('publicPreview')}</p>
      <article className="overflow-hidden rounded-[32px] border border-[#d5ddd6] bg-white shadow-[0_30px_90px_-45px_rgba(15,45,35,.45)]">
        <div className="h-3" style={{ backgroundColor: profile.theme && /^#[0-9A-Fa-f]{6}$/.test(profile.theme) ? profile.theme : '#173f32' }} />
        <div className="p-6 sm:p-9">
          <div className="flex items-start gap-4">{profile.avatarUrl ? <img src={profile.avatarUrl} alt="" className="size-20 shrink-0 rounded-3xl object-cover" /> : <div className="grid size-20 shrink-0 place-items-center rounded-3xl bg-[#dce7df] text-xl font-semibold text-[#17352c]">{initials}</div>}<div className="min-w-0"><div className="flex items-center gap-2"><h1 className="text-2xl font-semibold tracking-tight">{profile.name}</h1>{profile.isVerified && <span aria-label={t('verifiedReputation')} className="grid size-6 place-items-center rounded-full bg-emerald-700 text-white"><Check className="size-4" /></span>}</div>{title && <p className="mt-1 text-sm text-[#596760]">{title}{organization ? ` · ${organization}` : ''}</p>}{location && <p className="mt-3 flex items-center gap-1 text-xs text-[#7a8780]"><MapPin className="size-3" />{location}</p>}</div></div>
          {profile.bio && <p className="mt-6 text-sm leading-6 text-[#3d4a44]">{profile.bio}</p>}
          <div className="mt-8 flex items-end justify-between border-y border-[#e9ede9] py-6"><div><p className="text-5xl font-semibold tracking-[-.07em]">{Number(profile.reputation.score).toFixed(1)}<span className="text-sm text-[#7a8780]"> / 5</span></p><p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-800"><ShieldCheck className="size-4" />{t('verifiedReputation')}</p></div><p className="text-end text-xs text-[#7a8780]"><strong className="block text-base text-[#17352c]">{profile.reputation.credibleRatingCount}</strong>{t('basedOn')}</p></div>
          <div className="grid gap-3 py-6 text-sm">{profile.email && <a className="underline underline-offset-4" href={`mailto:${profile.email}`}>{profile.email}</a>}{profile.phone ? <a className="underline underline-offset-4" href={`tel:${profile.phone}`}>{profile.phone}</a> : <p className="flex items-center gap-2 text-[#7a8780]"><Lock className="size-4" />{t('requestPhone')}</p>}</div>
        </div>
      </article>
      <div className="mt-6 rounded-3xl bg-[#17352c] p-6 text-center text-white"><p className="font-semibold">{t('download')}</p><p className="mt-2 text-sm text-white/65">{t('appOnly')}</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Button nativeButton={false} render={<a href={process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/'} />} className="bg-white text-[#17352c] hover:bg-white/90">App Store</Button><Button nativeButton={false} render={<a href={process.env.NEXT_PUBLIC_PLAY_STORE_URL || 'https://play.google.com/store'} />} variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">Google Play</Button></div></div>
    </div>
  </main>
}
