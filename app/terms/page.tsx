import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { legalMetadata, termsOfService } from '@/lib/legal-docs'

export const metadata: Metadata = legalMetadata(termsOfService)

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms' },
        ]}
      />
      <LegalDocumentPage doc={termsOfService} />
    </>
  )
}
