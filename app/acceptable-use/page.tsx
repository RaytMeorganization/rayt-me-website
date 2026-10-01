import type { Metadata } from 'next'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { acceptableUse, legalMetadata } from '@/lib/legal-docs'

export const metadata: Metadata = legalMetadata(acceptableUse)

export default function AcceptableUsePage() {
  return <LegalDocumentPage doc={acceptableUse} />
}
