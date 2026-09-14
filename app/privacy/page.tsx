import type { Metadata } from 'next'
import { LegalPage } from '@/components/product/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — RaytME',
  description: 'How RaytME collects, uses, and protects professional identity data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return <LegalPage kind="privacy" />
}
