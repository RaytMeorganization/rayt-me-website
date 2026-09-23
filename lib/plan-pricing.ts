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
  USD_PER_EMPLOYEE_YEAR,
  USD_PRO_YEAR,
  usdToCents,
  type MarketingPlanCode,
  type MarketingPlanDefinition,
} from '../.local-packages/rayt-me-shared/src/plan-pricing'
