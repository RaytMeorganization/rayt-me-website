import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { PublicCard } from '@/components/product/public-card'
import { api, ApiError } from '@/lib/api'
import type { PublicProfile } from '@/lib/types'

const getProfile = cache(async (id: string) => {
  try {
    return await api<PublicProfile>(`/profiles/${encodeURIComponent(id)}/preview`, {}, { server: true })
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const profile = await getProfile(id)
    const role = profile.jobTitle || profile.education?.fieldOfStudy || 'Professional'
    const description = profile.bio?.slice(0, 160) || `View ${profile.name}'s verified professional reputation card on RaytME.`
    const url = `https://rate.me/p/${encodeURIComponent(id)}`
    return {
      title: `${profile.name} — ${role} | RaytME`,
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.jobTitle,
    image: profile.avatarUrl,
    url: `https://rate.me/p/${encodeURIComponent(profile.id)}`,
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PublicCard profile={profile} />
    </>
  )
}
