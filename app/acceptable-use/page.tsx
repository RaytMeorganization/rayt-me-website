import type { Metadata } from 'next'
import { requestLocale } from '@/lib/request-locale'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { acceptableUse, legalMetadata } from '@/lib/legal-docs'

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(acceptableUse, await requestLocale())
}

export default function AcceptableUsePage() {
  return <LegalDocumentPage doc={acceptableUse} />
}
