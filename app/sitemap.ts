import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'
import { WEB_SIGN_IN_DISABLED, WEB_SIGN_UP_DISABLED } from '@/lib/web-sign-in'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl(), lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...(!WEB_SIGN_IN_DISABLED
      ? [{ url: siteUrl('/sign-in'), lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 }]
      : []),
    ...(!WEB_SIGN_UP_DISABLED
      ? [{ url: siteUrl('/sign-up'), lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 }]
      : []),
    { url: siteUrl('/privacy'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: siteUrl('/terms'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: siteUrl('/p/demo-omar-al-kuwari'), lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]
}
