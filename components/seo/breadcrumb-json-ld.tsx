import { buildBreadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo-breadcrumb'

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = buildBreadcrumbJsonLd(items)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
