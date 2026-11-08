'use client'

import { use } from 'react'
import { EmployeeReputationView } from '@/components/product/analytics/employee-reputation-view'

export default function EmployeeReputationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <EmployeeReputationView employeeId={id} />
}
