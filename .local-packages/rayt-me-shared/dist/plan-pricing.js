/** Canonical marketing prices — consumed by website, backend seed, and mobile. */
export const USD_PRO_YEAR = 27;
export const USD_PER_EMPLOYEE_YEAR = 21;
export const MARKETING_PLANS = [
    { code: 'basic', name: 'BASIC', priceCents: 0, period: 'forever' },
    { code: 'pro', name: 'PRO', priceCents: USD_PRO_YEAR * 100, period: 'year' },
    {
        code: 'business',
        name: 'BUSINESS',
        priceCents: USD_PER_EMPLOYEE_YEAR * 100,
        period: 'employeeYear',
    },
];
export function marketingPlanByCode(code) {
    return MARKETING_PLANS.find((plan) => plan.code === code);
}
export function formatMarketingUsd(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(amount);
}
export function formatPriceCentsUsd(cents) {
    const amount = Number(cents);
    if (!Number.isFinite(amount))
        return '—';
    return formatMarketingUsd(amount / 100);
}
export function usdToCents(dollars) {
    return Math.round(dollars * 100);
}
export function centsToUsd(cents) {
    return cents / 100;
}
export function planPeriodLabel(period, t) {
    switch (period) {
        case 'forever':
            return t('pricePeriodForever');
        case 'year':
            return t('pricePeriodYear');
        case 'employeeYear':
            return t('pricePeriodEmployeeYear');
    }
}
export function matchesMarketingPrice(code, priceCents) {
    const catalog = marketingPlanByCode(code);
    if (!catalog)
        return null;
    return catalog.priceCents === priceCents;
}
