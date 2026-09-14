'use client'

import Link from 'next/link'
import { LogoLockup } from '@/components/brand/logo-lockup'
import { LocaleButton } from '@/components/product/shell'
import { buttonVariants } from '@/components/ui/button'
import { useI18n } from '@/components/product/providers'
import { WEB_SIGN_IN_DISABLED, WEB_SIGN_UP_DISABLED } from '@/lib/web-sign-in'
import { cn } from '@/lib/utils'

type MarketingShellProps = {
  children: React.ReactNode
  className?: string
  /** Hide header CTAs on auth pages */
  hideAuthLinks?: boolean
}

export function MarketingShell({ children, className, hideAuthLinks }: MarketingShellProps) {
  const { t } = useI18n()
  return (
    <div className={cn('rate-landing dark min-h-screen text-foreground', className)}>
      <header
        className="sticky top-0 z-50 border-b border-white/10 bg-[#110c1a]/45 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogoLockup tone="light" />
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <LocaleButton tone="dark" />
            {!hideAuthLinks && !WEB_SIGN_IN_DISABLED ? (
              <Link
                href="/sign-in"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'text-white/75 hover:text-white',
                })}
              >
                {t('signIn')}
              </Link>
            ) : null}
            {!hideAuthLinks && !WEB_SIGN_UP_DISABLED ? (
              <Link href="/sign-up" className={buttonVariants({ size: 'sm' })}>
                {t('signUp')}
              </Link>
            ) : null}
          </div>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
    </div>
  )
}
