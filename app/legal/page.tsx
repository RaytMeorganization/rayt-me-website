import type { Metadata } from 'next'
import { LegalHubPage } from '@/components/legal/legal-document'
import { COMPANY } from '@/lib/company'
import { legalMetadata } from '@/lib/legal-docs'

export const metadata: Metadata = legalMetadata({
  title: 'Legal',
  description: `Legal documents for ${COMPANY.displayName}: privacy, terms, acceptable use, and support.`,
  canonical: `${COMPANY.site}/legal`,
})

export default function LegalIndexPage() {
  return <LegalHubPage />
}
