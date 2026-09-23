/** Canonical marketing prices — consumed by website, backend seed, and mobile. */
export const USD_PRO_YEAR = 27;
export const USD_PER_EMPLOYEE_YEAR = 21;

export type MarketingPlanCode = 'basic' | 'pro' | 'business';

export type MarketingPlanDefinition = {
  code: MarketingPlanCode;
  name: string;
  priceCents: number;
  period: 'forever' | 'year' | 'employeeYear';
};

export const MARKETING_PLANS: MarketingPlanDefinition[] = [
  { code: 'basic', name: 'BASIC', priceCents: 0, period: 'forever' },
  { code: 'pro', name: 'PRO', priceCents: USD_PRO_YEAR * 100, period: 'year' },
  {
    code: 'business',
    name: 'BUSINESS',
    priceCents: USD_PER_EMPLOYEE_YEAR * 100,
    period: 'employeeYear',
  },
];

export function marketingPlanByCode(code: string) {
  return MARKETING_PLANS.find((plan) => plan.code === code);
}

export function formatMarketingUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceCentsUsd(cents: unknown) {
  const amount = Number(cents);
  if (!Number.isFinite(amount)) return '—';
  return formatMarketingUsd(amount / 100);
}

export function usdToCents(dollars: number) {
  return Math.round(dollars * 100);
}

export function centsToUsd(cents: number) {
  return cents / 100;
}

export function planPeriodLabel(
  period: MarketingPlanDefinition['period'],
  t: (key: 'pricePeriodForever' | 'pricePeriodYear' | 'pricePeriodEmployeeYear') => string,
) {
  switch (period) {
    case 'forever':
      return t('pricePeriodForever');
    case 'year':
      return t('pricePeriodYear');
    case 'employeeYear':
      return t('pricePeriodEmployeeYear');
  }
}

export function matchesMarketingPrice(code: string, priceCents: number) {
  const catalog = marketingPlanByCode(code);
  if (!catalog) return null;
  return catalog.priceCents === priceCents;
}
