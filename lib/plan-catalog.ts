import { api } from '@/lib/api'
import type { PublicPlanCatalogRow } from '@/lib/plan-pricing'

export async function fetchPublicPlanCatalog() {
  return api<PublicPlanCatalogRow[]>('/plans/catalog')
}
