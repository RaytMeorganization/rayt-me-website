import type { MetadataRoute } from 'next'
import { LOCALIZED_PATHS, localeAlternates, localePath } from '@/lib/locale-routes'
import { siteUrl } from '@/lib/site'

const now = new Date()

// Indexable pages only: auth/funnel pages are noindex and stay out of the sitemap.
// Localized pages list both the English and the /ar URL, each with reciprocal hreflang.
export default function sitemap(): MetadataRoute.Sitemap {
  const localized = LOCALIZED_PATHS.flatMap((path) => {
    const home = path === '/'
    const { languages } = localeAlternates(path, 'en')
    return (['en', 'ar'] as const).map((locale) => ({
      url: siteUrl(localePath(path, locale)),
      lastModified: now,
      changeFrequency: home ? ('weekly' as const) : ('monthly' as const),
      priority: home ? (locale === 'en' ? 1 : 0.9) : 0.5,
      alternates: { languages },
    }))
  })
  return [
    ...localized,
    {
      url: siteUrl('/p/demo-omar-al-kuwari'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]
}
