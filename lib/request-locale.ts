import { headers } from 'next/headers'
import { LOCALE_HEADER } from '@/lib/locale-routes'
import type { Locale } from '@/lib/types'

/** Locale set by proxy.ts for this request ('ar' only on /ar URLs). */
export async function requestLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER)
  return value === 'ar' ? 'ar' : 'en'
}
