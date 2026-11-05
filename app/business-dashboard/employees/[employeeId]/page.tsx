import { Suspense } from 'react'
import { EmployeeReputationPage } from '@/components/product/employee-reputation'
import { LoadingBlock } from '@/components/product/dashboard-ui'
import { ProductShell } from '@/components/product/shell'

export default async function EmployeeReputationRoute({
  params,
}: {
  params: Promise<{ employeeId: string }>
}) {
  const { employeeId } = await params
  return (
    <Suspense
      fallback={
        <ProductShell role="business">
          <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
            <LoadingBlock rows={4} />
          </main>
        </ProductShell>
      }
    >
      <EmployeeReputationPage employeeId={employeeId} />
    </Suspense>
  )
}
