import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { legalMetadata, privacyNotice } from '@/lib/legal-docs'

export const metadata: Metadata = legalMetadata(privacyNotice)

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy' },
        ]}
      />
      <LegalDocumentPage doc={privacyNotice} />
    </>
  )
}
