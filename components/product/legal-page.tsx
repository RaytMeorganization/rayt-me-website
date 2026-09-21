'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MarketingShell } from '@/components/product/marketing-shell'
import { useI18n } from '@/components/product/providers'

export function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { t } = useI18n()
  const title = kind === 'privacy' ? t('privacyPolicyTitle') : t('termsTitle')
  const sections =
    kind === 'privacy'
      ? [
          { heading: t('legalWhoWeAre'), body: t('legalWhoWeAreBody') },
          { heading: t('legalDataWeProcess'), body: t('legalDataWeProcessBody') },
          { heading: t('legalHowWeUse'), body: t('legalHowWeUseBody') },
          { heading: t('legalThirdParties'), body: t('legalThirdPartiesBody') },
          { heading: t('legalAiProcessing'), body: t('legalAiProcessingBody') },
          { heading: t('legalYourControls'), body: t('legalYourControlsBody') },
          { heading: t('legalPublicPreview'), body: t('legalPublicPreviewBody') },
          { heading: t('legalRetention'), body: t('legalRetentionBody') },
          { heading: t('legalContact'), body: t('legalContactBody') },
        ]
      : [
          { heading: t('legalAcceptableUse'), body: t('legalAcceptableUseBody') },
          { heading: t('legalUgc'), body: t('legalUgcBody') },
          { heading: t('legalReputation'), body: t('legalReputationBody') },
          { heading: t('legalAccounts'), body: t('legalAccountsBody') },
          { heading: t('legalContact'), body: t('legalContactBody') },
        ]

  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <Card className="border-white/10 bg-card/90 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">{t('legalCounselNote')}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {sections.map((section, index) => (
              <section key={section.heading}>
                {index > 0 ? <Separator className="mb-6 bg-white/10" /> : null}
                <h2 className="font-brand text-lg font-semibold text-foreground">{section.heading}</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{section.body}</p>
              </section>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 border-t border-white/10 bg-transparent sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-sm font-semibold text-primary underline underline-offset-4">
              {t('backHome')}
            </Link>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="mailto:privacy@rate.me" className="font-semibold text-primary underline underline-offset-4">
                privacy@rate.me
              </a>
              <a href="mailto:support@rate.me" className="font-semibold text-primary underline underline-offset-4">
                support@rate.me
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MarketingShell>
  )
}
