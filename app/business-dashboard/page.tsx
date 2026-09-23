import { Suspense } from 'react'
import { BusinessDashboard } from '@/components/product/business-dashboard'
import { LoadingBlock } from '@/components/product/dashboard-ui'
import { ProductShell } from '@/components/product/shell'

function BusinessFallback() {
  return (
    <ProductShell role="business">
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <LoadingBlock rows={5} />
      </main>
    </ProductShell>
  )
}

export default function BusinessDashboardPage() {
  return (
    <Suspense fallback={<BusinessFallback />}>
      <BusinessDashboard />
    </Suspense>
  )
}
