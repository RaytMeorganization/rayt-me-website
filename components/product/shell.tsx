'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Globe2, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth, useI18n } from '@/components/product/providers'
import type { Role } from '@/lib/types'

export function LocaleButton() {
  const { locale, setLocale } = useI18n()
  return <Button variant="outline" size="sm" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} aria-label="Change language"><Globe2 />{locale === 'en' ? 'العربية' : 'EN'}</Button>
}

export function ProductShell({ children, role = 'user' }: { children: React.ReactNode; role?: Role }) {
  const { t } = useI18n()
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`)
    else if (role !== 'user' && user.role !== role) router.replace('/settings')
  }, [loading, pathname, role, router, user])

  if (loading || !user || (role !== 'user' && user.role !== role)) {
    return <main className="grid min-h-screen place-items-center" aria-busy="true"><p className="text-sm text-muted-foreground">{t('loading')}</p></main>
  }

  const home = role === 'admin' ? '/admin-dashboard' : role === 'business' ? '/business-dashboard' : '/settings'
  return <div className="min-h-screen bg-[#f7f8f4]">
    <header className="border-b border-[#dfe4de] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href={home} className="flex items-center gap-2 font-semibold text-[#17352c]"><ShieldCheck className="text-emerald-700" />{t('brand')}</Link>
        <div className="flex items-center gap-2"><LocaleButton /><Button variant="ghost" size="sm" onClick={() => void logout()}><LogOut />{t('signOut')}</Button></div>
      </div>
    </header>
    {children}
  </div>
}

export function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-[#d9dfd9] bg-white p-6 shadow-sm ${className}`}><h2 className="text-xl font-semibold tracking-tight">{title}</h2><div className="mt-5">{children}</div></section>
}

export const inputClass = 'min-h-11 w-full rounded-xl border border-[#cbd3cd] bg-white px-3 text-sm outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20'
