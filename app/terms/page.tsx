import type { Metadata } from 'next'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { legalMetadata, termsOfService } from '@/lib/legal-docs'

export const metadata: Metadata = legalMetadata(termsOfService)

export default function TermsPage() {
  return <LegalDocumentPage doc={termsOfService} />
}
