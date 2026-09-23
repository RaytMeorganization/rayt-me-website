import { Suspense } from 'react'
import { AdminDashboard } from '@/components/product/admin-dashboard'
import { LoadingBlock } from '@/components/product/dashboard-ui'
import { ProductShell } from '@/components/product/shell'

function AdminFallback() {
  return (
    <ProductShell role="admin">
      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <LoadingBlock rows={5} />
      </main>
    </ProductShell>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminDashboard />
    </Suspense>
  )
}
