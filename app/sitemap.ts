import type { MetadataRoute } from 'next'
import { WEB_SIGN_IN_DISABLED, WEB_SIGN_UP_DISABLED } from '@/lib/web-sign-in'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://rate.me', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...(!WEB_SIGN_IN_DISABLED
      ? [{ url: 'https://rate.me/sign-in', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 }]
      : []),
    ...(!WEB_SIGN_UP_DISABLED
      ? [{ url: 'https://rate.me/sign-up', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 }]
      : []),
    { url: 'https://rate.me/p/demo-omar-al-kuwari', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]
}
