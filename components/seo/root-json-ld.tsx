import { buildRootJsonLdGraph } from '@/lib/seo'

/** Machine-readable site graph for Google rich results (FAQ, organization, app). */
export function RootJsonLd() {
  const graph = buildRootJsonLdGraph()
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
