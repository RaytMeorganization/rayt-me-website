import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { PublicCard } from '@/components/product/public-card'
import { api, ApiError } from '@/lib/api'
import { siteUrl } from '@/lib/site'
import type { PublicProfile } from '@/lib/types'

/** Resolves to `null` on 404 so callers can raise `notFound()` before any streaming starts. */
const getProfile = cache(async (id: string): Promise<PublicProfile | null> => {
  try {
    return await api<PublicProfile>(`/profiles/${encodeURIComponent(id)}/preview`, {}, { server: true })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  let profile: PublicProfile | null
  try {
    profile = await getProfile(id)
  } catch {
    return { title: 'Professional profile — RaytME', robots: { index: false, follow: false } }
  }
  // Raised here, before the page body streams, so the response carries a real 404 status.
  if (!profile) notFound()
  try {
    const role = profile.jobTitle || profile.education?.fieldOfStudy || 'Professional'
    const description = profile.bio?.slice(0, 160) || `View ${profile.name}'s verified professional reputation card on RaytME.`
    const url = siteUrl(`/p/${encodeURIComponent(id)}`)
    return {
      // absolute: the root layout already appends " · RaytME".
      title: { absolute: `${profile.name} — ${role} | RaytME` },
      description,
      alternates: { canonical: url },
      openGraph: {
        title: `${profile.name} — RaytME`,
        description,
        type: 'profile',
        url,
        images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
      },
      twitter: { card: profile.avatarUrl ? 'summary_large_image' : 'summary', title: `${profile.name} — RaytME`, description },
    }
  } catch {
    return { title: 'Professional profile — RaytME', robots: { index: false, follow: false } }
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile(id)
  if (!profile) notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.jobTitle,
    image: profile.avatarUrl,
    url: siteUrl(`/p/${encodeURIComponent(profile.id)}`),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicCard profile={profile} />
    </>
  )
}
