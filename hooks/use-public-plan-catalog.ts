'use client'

import { useEffect, useState } from 'react'

import { fetchPublicPlanCatalog } from '@/lib/plan-catalog'
import { MARKETING_PLANS, type PublicPlanCatalogRow } from '@/lib/plan-pricing'

export function usePublicPlanCatalog() {
  const [plans, setPlans] = useState<PublicPlanCatalogRow[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    void fetchPublicPlanCatalog()
      .then(rows => {
        if (!cancelled) setPlans(rows)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const fallback: PublicPlanCatalogRow[] = MARKETING_PLANS.map(plan => ({
    code: plan.code,
    name: plan.name,
    priceCents: plan.priceCents,
    monthlyPriceCents: plan.monthlyPriceCents,
  }))

  return {
    plans: plans ?? fallback,
    loading: plans === null && !error,
    fromApi: plans !== null,
  }
}
