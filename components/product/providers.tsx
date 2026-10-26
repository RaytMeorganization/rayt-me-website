'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { dictionaries } from '@/lib/i18n'
import { WEB_SIGN_IN_DISABLED } from '@/lib/web-sign-in'
import { isLocalizedPath, localePath, splitLocalePath } from '@/lib/locale-routes'
import type { Locale, User } from '@/lib/types'

type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: keyof typeof dictionaries.en) => string }
const I18nContext = createContext<I18nValue | null>(null)

type AuthValue = {
  user: User | null
  loading: boolean
  refresh: () => Promise<User | null>
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthValue | null>(null)

export function Providers({ children, initialLocale = 'en' }: { children: React.ReactNode; initialLocale?: Locale }) {
  // /ar URLs are server-rendered in Arabic; sync storage before children read it.
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (initialLocale === 'ar' && typeof window !== 'undefined') window.localStorage.setItem('rate-me-locale', 'ar')
    return initialLocale
  })
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const saved = window.localStorage.getItem('rate-me-locale')
    const { locale: urlLocale, path } = splitLocalePath(window.location.pathname)
    if (isLocalizedPath(path)) {
      // Pages with their own Arabic URL: the URL decides; a saved Arabic preference opens /ar.
      if (urlLocale === 'en' && saved === 'ar') {
        window.location.replace(`${localePath(path, 'ar')}${window.location.search}${window.location.hash}`)
      }
      return
    }
    const timer = window.setTimeout(() => { if (saved === 'ar') setLocaleState('ar') }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem('rate-me-locale', next)
    const { path } = splitLocalePath(window.location.pathname)
    if (isLocalizedPath(path)) {
      // Full navigation so the server renders the matching language URL (lang/dir, canonical).
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full reload needed: lang/dir come from the server
      window.location.assign(`${localePath(path, next)}${window.location.search}${window.location.hash}`)
      return
    }
    setLocaleState(next)
    window.dispatchEvent(new Event('rate-me-locale-change'))
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.classList.toggle('arabic-mode', locale === 'ar')
  }, [locale])

  const refresh = useCallback(async () => {
    try {
      const session = await api<User>('/me')
      setUser(session)
      return session
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh() }, 0)
    return () => window.clearTimeout(timer)
  }, [refresh])

  const logout = useCallback(async () => {
    try { await api('/auth/logout', { method: 'POST' }) } finally {
      setUser(null)
      router.push(WEB_SIGN_IN_DISABLED ? '/' : '/sign-in')
      router.refresh()
    }
  }, [router])

  const i18n = useMemo<I18nValue>(() => ({
    locale, setLocale,
    t: (key) => dictionaries[locale][key],
  }), [locale, setLocale])
  const auth = useMemo(() => ({ user, loading, refresh, logout }), [user, loading, refresh, logout])

  return <I18nContext.Provider value={i18n}><AuthContext.Provider value={auth} key={pathname}>{children}</AuthContext.Provider></I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used within Providers')
  return value
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within Providers')
  return value
}
