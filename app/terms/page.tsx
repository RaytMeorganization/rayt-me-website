import type { Metadata } from 'next'
import { LegalPage } from '@/components/product/legal-page'

export const metadata: Metadata = {
  title: 'Terms of Service — RaytME',
  description: 'Terms governing use of the RaytME website and professional reputation platform.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return <LegalPage kind="terms" />
}
