'use client'

import Link from 'next/link'
import { LogoLockup } from '@/components/brand/logo-lockup'
import { Backdrop } from '@/components/product/brand-art'
import { LocaleButton } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useI18n()
  const title = kind === 'privacy' ? t('privacyPolicyTitle') : t('termsTitle')
  const sections =
    kind === 'privacy'
      ? [
          { heading: t('legalDataWeProcess'), body: t('legalDataWeProcessBody') },
          { heading: t('legalYourControls'), body: t('legalYourControlsBody') },
          { heading: t('legalPublicPreview'), body: t('legalPublicPreviewBody') },
          { heading: t('legalRetention'), body: t('legalRetentionBody') },
        ]
      : [
          { heading: t('legalAcceptableUse'), body: t('legalAcceptableUseBody') },
          { heading: t('legalReputation'), body: t('legalReputationBody') },
          { heading: t('legalAccounts'), body: t('legalAccountsBody') },
          { heading: t('legalContact'), body: t('legalContactBody') },
        ]

  return (
    <main className="relative min-h-screen px-5 py-10 text-[#11213D]">
      <Backdrop />
      <div className="relative z-10 mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AD8547]/30">
          <LogoLockup size="sm" />
        </Link>
        <LocaleButton />
      </div>
      <article className="relative z-10 mx-auto mt-10 max-w-3xl rounded-[28px] border border-[#eae2d1] bg-white p-6 shadow-xl shadow-emerald-950/5 sm:p-9">
        <h1 className="font-serif text-3xl font-semibold tracking-[-.02em] text-[#11213D]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#5c6b64]">{t('legalCounselNote')}</p>
        <div className="mt-8 grid gap-6">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-[#11213D]">{section.heading}</h2>
              <p className="mt-2 text-sm leading-7 text-[#4a5a53]">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm">
          <Link href="/" className="font-semibold text-[#8C6B37] underline">{t('backHome')}</Link>
        </p>
      </article>
    </main>
  )
}
