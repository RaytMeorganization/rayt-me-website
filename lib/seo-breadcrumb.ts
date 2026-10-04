import { SITE_ORIGIN } from '@/lib/site'

export type BreadcrumbItem = { name: string; path: string }

/** BreadcrumbList JSON-LD (Google rich results / URL understanding). */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${SITE_ORIGIN}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  }
}
