import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicCard } from '@/components/product/public-card'
import { api, ApiError } from '@/lib/api'
import type { PublicProfile } from '@/lib/types'

async function getProfile(id: string) {
  try { return await api<PublicProfile>(`/profiles/${encodeURIComponent(id)}/preview`, {}, { server: true }) }
  catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound()
    throw error
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  try {
    const profile = await getProfile(id)
    const role = profile.jobTitle || profile.education?.fieldOfStudy || 'Professional'
    return {
      title: `${profile.name} — ${role} | Rayt Me`,
      description: `View ${profile.name}'s verified professional reputation card on Rayt Me.`,
      openGraph: { title: `${profile.name} — Rayt Me`, description: `Verified professional reputation card for ${profile.name}.`, type: 'profile' },
    }
  } catch { return { title: 'Professional profile — Rayt Me', robots: { index: false, follow: false } } }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PublicCard profile={await getProfile(id)} />
}
