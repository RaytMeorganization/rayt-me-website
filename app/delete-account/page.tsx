import type { Metadata } from 'next'
import { requestLocale } from '@/lib/request-locale'
import { DeleteAccountLegalPage } from '@/components/legal/legal-document'
import { COMPANY, STORE_URLS } from '@/lib/company'
import { legalMetadata } from '@/lib/legal-docs'

export async function generateMetadata(): Promise<Metadata> {
  return legalMetadata(
    {
      title: 'Delete account and data',
      description: `Request deletion of your ${COMPANY.brand} account and associated personal data.`,
      canonical: STORE_URLS.deleteAccount,
    },
    await requestLocale(),
  )
}

export default function DeleteAccountPage() {
  return <DeleteAccountLegalPage />
}
