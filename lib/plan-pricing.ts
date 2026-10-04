/**
 * Website facade for marketing plan helpers.
 * Re-export from the committed vendored package so CI and Docker builds
 * never depend on a sibling ../rayt-me-shared checkout.
 */
export {
  centsToUsd,
  formatMarketingUsd,
  formatPriceCentsUsd,
  MARKETING_PLANS,
  marketingPlanByCode,
  matchesMarketingPrice,
  planPeriodLabel,
  resolvePlanPrices,
  yearlyOfferCopy,
  USD_PER_EMPLOYEE_MONTH,
  USD_PER_EMPLOYEE_YEAR,
  USD_PER_EMPLOYEE_YEARLY_SAVINGS,
  USD_PRO_MONTH,
  USD_PRO_YEAR,
  USD_PRO_YEARLY_SAVINGS,
  usdToCents,
  type BillingInterval,
  type MarketingPlanCode,
  type MarketingPlanDefinition,
  type PublicPlanCatalogRow,
  type YearlyOfferCopy,
} from '../.local-packages/rayt-me-shared/src/plan-pricing'
