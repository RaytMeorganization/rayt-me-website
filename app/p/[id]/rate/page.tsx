import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { WebRatingFlow } from '@/components/product/web-rating-flow'
import { api, ApiError } from '@/lib/api'
import { siteUrl } from '@/lib/site'
import type { PublicProfile } from '@/lib/types'

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
  const profile = await getProfile(id)
  if (!profile) return { title: 'Rate — RaytME', robots: { index: false, follow: false } }
  return {
    title: { absolute: `Rate ${profile.name} | RaytME` },
    description: `Verify your email and rate ${profile.name} on RaytME.`,
    alternates: { canonical: siteUrl(`/p/${encodeURIComponent(id)}/rate`) },
    robots: { index: false, follow: false },
  }
}

export default async function WebRatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getProfile(id)
  if (!profile) notFound()
  return <WebRatingFlow profile={profile} />
}
