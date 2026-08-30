'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe2, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Backdrop, EmptyState } from '@/components/product/brand-art'
import { MotionDirector } from '@/components/product/premium-motion'
import { useAuth, useI18n } from '@/components/product/providers'
import type { Role } from '@/lib/types'

export function LocaleButton() {
  const { locale, setLocale } = useI18n()
  return <button type="button" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} aria-label="Change language" className="inline-flex h-7 items-center justify-center gap-1 rounded-lg border border-[#eae2d1] bg-white px-2.5 text-[.8rem] font-medium text-[#11213D] transition-colors hover:bg-[#faf6ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AD8547]/30"><Globe2 className="size-3.5" />{locale === 'en' ? 'العربية' : 'EN'}</button>
}

const homeFor = (role?: Role) => role === 'admin' ? '/admin-dashboard' : role === 'business' ? '/business-dashboard' : '/settings'

function Chrome({ children, nav }: { children: React.ReactNode; nav?: React.ReactNode }) {
  const { t } = useI18n()
  return <div className="relative min-h-screen">
    <Backdrop />
    <MotionDirector />
    <div className="relative z-10">
      <header className="rate-premium-nav sticky top-0 z-40 border-b border-[#eae2d1] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[#11213D]"><ShieldCheck className="text-[#2E6B4C]" />{t('brand')}</Link>
          {nav}
        </div>
      </header>
      {children}
    </div>
  </div>
}

/** Full-height branded state used while the session resolves or access is denied. */
function Gate({ children }: { children: React.ReactNode }) {
  return <Chrome nav={<LocaleButton />}>
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-5">
      <div className="w-full rounded-3xl border border-[#eae2d1] bg-white p-2 shadow-sm">{children}</div>
    </main>
  </Chrome>
}

export function ProductShell({ children, role = 'user' }: { children: React.ReactNode; role?: Role }) {
  const { t } = useI18n()
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const denied = Boolean(user) && role !== 'user' && user?.role !== role

  useEffect(() => {
    if (loading || user) return
    router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`)
  }, [loading, pathname, router, user])

  if (loading) {
    return <Gate>
      <div aria-busy="true" className="flex flex-col items-center gap-4 px-6 py-14 text-center">
        <span className="size-10 animate-spin rounded-full border-2 border-[#e1eee6] border-t-[#11213D]" />
        <p className="text-sm font-medium text-[#11213D]">{t('preparingWorkspace')}</p>
      </div>
    </Gate>
  }

  if (!user) {
    return <Gate>
      <EmptyState
        kind="locked"
        title={t('signInRequired')}
        description={t('signInRequiredHelp')}
        action={<Button render={<Link href={`/sign-in?next=${encodeURIComponent(pathname)}`} />} className="bg-[#11213D]">{t('signIn')}</Button>}
      />
    </Gate>
  }

  if (denied) {
    return <Gate>
      <EmptyState
        kind="locked"
        title={t('accessRestricted')}
        description={t('accessRestrictedHelp')}
        action={<Button render={<Link href={homeFor(user.role)} />} className="bg-[#11213D]">{t('goToWorkspace')}</Button>}
      />
    </Gate>
  }

  const links: [string, string][] = [
    ['/settings', t('settings')],
    ['/verify', t('verification')],
    ...(user.role === 'admin' ? [['/admin-dashboard', t('admin')] as [string, string]] : []),
    ...(user.role === 'business' ? [['/business-dashboard', t('business')] as [string, string]] : []),
  ]

  return <Chrome nav={<div className="flex flex-wrap items-center gap-2">
    <nav aria-label={t('brand')} className="flex flex-wrap items-center gap-1">
      {links.map(([href, label]) => {
        const active = pathname === href
        return <Link
          key={href}
          href={href}
          aria-current={active ? 'page' : undefined}
          className={`rounded-full px-3 py-2 text-sm transition ${active ? 'bg-[#11213D] font-semibold text-white' : 'text-[#4a5a53] hover:bg-[#f4e9d3]'}`}
        >{label}</Link>
      })}
    </nav>
    <span className="hidden max-w-[14rem] truncate rounded-full bg-[#f4e9d3] px-3 py-2 text-xs font-medium text-[#11213D] sm:block" title={user.email}>{user.name}</span>
    <LocaleButton />
    <Button variant="ghost" size="sm" onClick={() => void logout()}><LogOut />{t('signOut')}</Button>
  </div>}>{children}</Chrome>
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div data-premium-reveal className="flex flex-wrap items-end justify-between gap-4">
    <div>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-[#255840]">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-[-.02em] text-[#11213D]">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5c6b64]">{description}</p>}
    </div>
    {action}
  </div>
}

export function Panel({ title, description, children, className = '' }: { title: string; description?: string; children: React.ReactNode; className?: string }) {
  return <section data-premium-reveal className={`rate-premium-card rounded-3xl border border-[#eae2d1] bg-white p-6 shadow-sm ${className}`}>
    <h2 className="text-xl font-semibold tracking-tight text-[#11213D]">{title}</h2>
    {description && <p className="mt-1 text-sm text-[#5c6b64]">{description}</p>}
    <div className="mt-5">{children}</div>
  </section>
}

export const inputClass = 'min-h-11 w-full rounded-xl border border-[#eae2d1] bg-white px-3 text-sm text-[#11213D] outline-none placeholder:text-[#8a978f] focus:border-[#AD8547] focus:ring-2 focus:ring-[#AD8547]/20'
