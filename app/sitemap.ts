import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://rate.me', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://rate.me/sign-in', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://rate.me/sign-up', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://rate.me/p/demo-omar-al-kuwari', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]
}
