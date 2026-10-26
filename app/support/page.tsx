import type { Metadata } from 'next'
import { requestLocale } from '@/lib/request-locale'
import { SupportLegalPage } from '@/components/legal/legal-document'
import { COMPANY, STORE_URLS } from '@/lib/company'
import { legalMetadata } from '@/lib/legal-docs'

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(
    {
    title: 'Support',
    description: `Contact ${COMPANY.displayName} for app support, privacy requests, and safety reports.`,
    canonical: STORE_URLS.support,
  },
    await requestLocale(),
  )
}

export default function SupportPage() {
  return <SupportLegalPage />
}
