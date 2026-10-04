import { MarketingShell } from '@/components/product/marketing-shell'
import { GetStartedFunnel } from '@/components/product/get-started-funnel'
import { funnelFromSearch } from '@/lib/get-started-funnel'
import { buildPublicPageMetadata } from '@/lib/seo'

export const metadata = buildPublicPageMetadata({
  title: 'Get started — create your RaytME card',
  description:
    'Create your RaytME account, choose Basic, Pro, or Business, and open your portable professional reputation card.',
  path: '/get-started',
})

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const initial = funnelFromSearch(await searchParams)
  return (
    <MarketingShell hideAuthLinks>
      <GetStartedFunnel
        initialPlan={initial.plan}
        initialInterval={initial.interval}
        initialEmployees={initial.employees}
        initialEditing={initial.editing}
      />
    </MarketingShell>
  )
}
