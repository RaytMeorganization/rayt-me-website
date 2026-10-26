import type { Metadata } from 'next'
import { requestLocale } from '@/lib/request-locale'
import { BreadcrumbJsonLd } from '@/components/seo/breadcrumb-json-ld'
import { LegalDocumentPage } from '@/components/legal/legal-document'
import { legalMetadata, privacyNotice } from '@/lib/legal-docs'

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(privacyNotice, await requestLocale())
}

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
