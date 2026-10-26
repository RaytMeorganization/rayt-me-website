'use client'

import Link from 'next/link'

import { useI18n } from '@/components/product/providers'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useI18n()
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t('somethingWentWrong')}</h1>
      <button type="button" onClick={reset} className="underline">
        {t('tryAgain')}
      </button>
      <Link href="/" className="underline">
        {t('backHome')}
      </Link>
    </main>
  )
}
