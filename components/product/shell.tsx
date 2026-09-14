'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe2, LogOut } from 'lucide-react'
import { LogoLockup } from '@/components/brand/logo-lockup'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/product/brand-art'
import { MotionDirector } from '@/components/product/premium-motion'
import { useAuth, useI18n } from '@/components/product/providers'
import { WEB_SIGN_IN_DISABLED } from '@/lib/web-sign-in'
import type { Role } from '@/lib/types'

export function LocaleButton({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { locale, setLocale } = useI18n()
  const dark = tone === 'dark'
  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
      aria-label="Change language"
      className={
        dark
          ? 'inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 text-[.8rem] font-medium text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          : 'inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-[#eae2d1] bg-white px-2.5 text-[.8rem] font-medium text-[#11213D] transition-colors hover:bg-[#faf6ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AD8547]/30'
      }
    >
      <Globe2 data-icon="inline-start" />
      {locale === 'en' ? 'العربية' : 'EN'}
    </button>
  )
}

const homeFor = (role?: Role) => role === 'admin' ? '/admin-dashboard' : role === 'business' ? '/business-dashboard' : '/settings'

function Chrome({ children, nav }: { children: React.ReactNode; nav?: React.ReactNode }) {
  return (
    <div className="rate-landing dark relative min-h-screen text-foreground">
      <MotionDirector />
      <header
        className="sticky top-0 z-40 border-b border-white/10 bg-[#110c1a]/45 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 lg:px-8">
          <Link href="/" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <LogoLockup tone="light" size="sm" />
          </Link>
          {nav}
        </div>
      </header>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/** Full-height branded state used while the session resolves or access is denied. */
function Gate({ children }: { children: React.ReactNode }) {
  return (
    <Chrome nav={<LocaleButton tone="dark" />}>
      <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5 py-10">
        <div className="w-full rounded-3xl border border-white/10 bg-card/90 p-2 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          {children}
        </div>
      </main>
    </Chrome>
  )
}

export function ProductShell({ children, role = 'user' }: { children: React.ReactNode; role?: Role }) {
  const { t } = useI18n()
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const denied = Boolean(user) && role !== 'user' && user?.role !== role

  useEffect(() => {
    if (loading || user) return
    router.replace(WEB_SIGN_IN_DISABLED ? '/' : `/sign-in?next=${encodeURIComponent(pathname)}`)
  }, [loading, pathname, router, user])

  if (loading) {
    return <Gate>
      <div aria-busy="true" className="flex flex-col items-center gap-4 px-6 py-14 text-center">
        <span className="size-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="text-sm font-medium text-foreground">{t('preparingWorkspace')}</p>
      </div>
    </Gate>
  }

  if (!user) {
    return <Gate>
      <EmptyState
        kind="locked"
        title={t('signInRequired')}
        description={t('signInRequiredHelp')}
        action={
          WEB_SIGN_IN_DISABLED ? undefined : (
            <Button render={<Link href={`/sign-in?next=${encodeURIComponent(pathname)}`} />}>
              {t('signIn')}
            </Button>
          )
        }
      />
    </Gate>
  }

  if (denied) {
    return <Gate>
      <EmptyState
        kind="locked"
        title={t('accessRestricted')}
        description={t('accessRestrictedHelp')}
        action={<Button render={<Link href={homeFor(user.role)} />}>{t('goToWorkspace')}</Button>}
      />
    </Gate>
  }

  const links: [string, string][] = [
    ['/settings', t('settings')],
    ['/settings?tab=verification', t('verification')],
    ...(user.role === 'admin' ? [['/admin-dashboard', t('admin')] as [string, string]] : []),
    ...(user.role === 'business' ? [['/business-dashboard', t('business')] as [string, string]] : []),
  ]

  return <Chrome nav={<div className="flex flex-wrap items-center gap-2">
    <nav aria-label={t('brand')} className="flex flex-wrap items-center gap-1">
      {links.map(([href, label]) => {
        const path = href.split('?')[0]
        const active = pathname === path
        return <Link
          key={href}
          href={href}
          aria-current={active ? 'page' : undefined}
          className={`rounded-full px-3 py-2 text-sm transition ${active ? 'bg-primary font-semibold text-primary-foreground' : 'text-muted-foreground hover:bg-white/10 hover:text-foreground'}`}
        >{label}</Link>
      })}
    </nav>
    <span className="hidden max-w-[14rem] truncate rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-foreground sm:block" title={user.email}>{user.name}</span>
    <LocaleButton tone="dark" />
    <Button variant="ghost" size="sm" onClick={() => void logout()}><LogOut />{t('signOut')}</Button>
  </div>}>{children}</Chrome>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div data-premium-reveal className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function Panel({ title, description, children, className = '' }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <section
      data-premium-reveal
      className={`rounded-3xl border border-white/10 bg-card/90 p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl ${className}`}
    >
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export const inputClass =
  'min-h-11 w-full rounded-xl border border-input bg-input/30 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
