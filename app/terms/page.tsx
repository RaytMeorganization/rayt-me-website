import type { Metadata } from 'next'
import { requestLocale } from '@/lib/request-locale'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { legalMetadata, termsOfService } from '@/lib/legal-docs'

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(termsOfService, await requestLocale())
}

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
