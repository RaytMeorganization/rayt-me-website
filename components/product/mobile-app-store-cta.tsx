'use client'

import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/store-links'
import { useI18n } from '@/components/product/providers'
import { cn } from '@/lib/utils'

export function MobileAppStoreCta({ className }: { className?: string }) {
  const { t } = useI18n()

  return (
    <section
      className={cn(
        'rounded-2xl border border-white/10 bg-muted/20 px-5 py-6 sm:px-6',
        className,
      )}
      aria-labelledby="mobile-app-cta-heading"
    >
      <h2 id="mobile-app-cta-heading" className="font-brand text-lg font-semibold text-foreground">
        {t('settingsProceedToApp')}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t('settingsProceedToAppHelp')}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href={APP_STORE_URL}
          className="inline-flex h-11 min-w-[8.5rem] shrink-0 items-center gap-2 rounded-lg bg-black px-3 ring-1 ring-white/20 transition hover:ring-white/35"
          rel="noopener noreferrer"
          target="_blank"
          aria-label={t('appStoreBadge')}
        >
          <svg viewBox="0 0 16 19" className="h-[18px] w-4 shrink-0 text-white" aria-hidden="true">
            <path
              fill="currentColor"
              d="M13.2 9.9c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.3Zm-2-5.9c.6-.7 1-1.7.9-2.7-.9.1-1.9.6-2.5 1.3-.6.6-1.1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2Z"
            />
          </svg>
          <span className="pe-0.5 leading-none text-white">
            <span className="block text-[8px] tracking-wide text-white/70">Download on the</span>
            <span className="whitespace-nowrap text-[13px] font-semibold">App Store</span>
          </span>
        </a>
        <a
          href={PLAY_STORE_URL}
          className="inline-flex h-11 min-w-[8.5rem] shrink-0 items-center gap-2 rounded-lg bg-black px-3 ring-1 ring-white/20 transition hover:ring-white/35"
          rel="noopener noreferrer"
          target="_blank"
          aria-label={t('playStoreBadge')}
        >
          <svg viewBox="0 0 18 20" className="h-[18px] w-[16px] shrink-0" aria-hidden="true">
            <path d="M1 1.2 10.4 10 1 18.8V1.2Z" fill="#34A853" />
            <path d="M1 18.8 10.4 10 13.7 13.2 3.3 19.6c-.8.5-1.8.3-2.3-.4Z" fill="#FBBC04" />
            <path d="M14.8 7.2 13.7 6.8 10.4 10l3.3 3.2 1.1-.4c1.1-.6 1.1-2.1 0-2.8Z" fill="#4285F4" />
            <path d="M1 1.2C1.5.5 2.5.3 3.3.8L13.7 6.8 10.4 10 1 1.2Z" fill="#EA4335" />
          </svg>
          <span className="pe-0.5 leading-none text-white">
            <span className="block text-[8px] tracking-[0.12em] text-white/70">GET IT ON</span>
            <span className="whitespace-nowrap text-[13px] font-semibold">Google Play</span>
          </span>
        </a>
      </div>
    </section>
  )
}
