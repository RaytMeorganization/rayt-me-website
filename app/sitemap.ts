import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

const now = new Date()

// Indexable pages only: auth/funnel pages are noindex and stay out of the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const legal = ['/privacy', '/terms', '/acceptable-use', '/support', '/legal'] as const
  return [
    { url: siteUrl(), lastModified: now, changeFrequency: 'weekly', priority: 1 },
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
