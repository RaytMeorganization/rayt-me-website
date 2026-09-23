import type { MetadataRoute } from 'next'
import { SITE_ORIGIN, siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/settings', '/admin', '/business'] },
    sitemap: siteUrl('/sitemap.xml'),
    host: SITE_ORIGIN,
  }
}
