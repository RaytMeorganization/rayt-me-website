import type { Metadata } from 'next'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { legalMetadata, privacyNotice } from '@/lib/legal-docs'

export const metadata: Metadata = legalMetadata(privacyNotice)

export default function PrivacyPage() {
  return <LegalDocumentPage doc={privacyNotice} />
}
