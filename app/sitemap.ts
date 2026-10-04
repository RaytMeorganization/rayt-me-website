import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { WEB_SIGN_IN_DISABLED, WEB_SIGN_UP_DISABLED } from '@/lib/web-sign-in'

const now = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  const legal = ['/privacy', '/terms', '/acceptable-use', '/support', '/legal'] as const
  return [
    { url: siteUrl(), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...(!WEB_SIGN_IN_DISABLED
      ? [
          { url: siteUrl('/sign-in'), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.4 },
          { url: siteUrl('/forgot-password'), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.3 },
        ]
      : []),
    ...(!WEB_SIGN_UP_DISABLED
      ? [{ url: siteUrl('/sign-up'), lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 }]
      : []),
    {
      url: siteUrl('/p/demo-omar-al-kuwari'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...legal.map((path) => ({
      url: siteUrl(path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}
