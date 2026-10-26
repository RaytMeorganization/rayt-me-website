import { siteUrl } from '@/lib/site'
import type { Locale } from '@/lib/types'

/** Indexable pages that also have a server-rendered Arabic URL under /ar. */
export const LOCALIZED_PATHS = ['/', '/privacy', '/terms', '/acceptable-use', '/support', '/legal'] as const

export const LOCALE_HEADER = 'x-rayt-locale'

export function isLocalizedPath(path: string) {
  return (LOCALIZED_PATHS as readonly string[]).includes(path)
}

/** '/ar/privacy' -> { locale: 'ar', path: '/privacy' }; other paths stay English. */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  if (pathname === '/ar') return { locale: 'ar', path: '/' }
  if (pathname.startsWith('/ar/')) return { locale: 'ar', path: pathname.slice(3) || '/' }
  return { locale: 'en', path: pathname }
}

export function localePath(path: string, locale: Locale) {
  if (locale !== 'ar') return path
  return path === '/' ? '/ar' : `/ar${path}`
}

/** Self canonical plus reciprocal en / ar / x-default (English) hreflang, all on the apex. */
export function localeAlternates(path: string, locale: Locale) {
  return {
    canonical: siteUrl(localePath(path, locale)),
    languages: {
      en: siteUrl(path),
      ar: siteUrl(localePath(path, 'ar')),
      'x-default': siteUrl(path),
    },
  }
}
