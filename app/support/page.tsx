import type { Metadata } from 'next'
import { SupportLegalPage } from '@/components/legal/legal-document'
import { COMPANY, STORE_URLS } from '@/lib/company'
import { legalMetadata } from '@/lib/legal-docs'

export const metadata: Metadata = legalMetadata({
  title: 'Support',
  description: `Contact ${COMPANY.displayName} for app support, privacy requests, and safety reports.`,
  canonical: STORE_URLS.support,
})

export default function SupportPage() {
  return <SupportLegalPage />
}
