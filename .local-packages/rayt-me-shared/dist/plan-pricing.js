/** Canonical marketing prices — consumed by website, backend seed, and mobile. */
export const USD_PRO_YEAR = 48;
export const USD_PER_EMPLOYEE_YEAR = 36;
export const USD_PRO_MONTH = 6;
export const USD_PER_EMPLOYEE_MONTH = 5;
/** Savings when choosing yearly vs 12× monthly (USD). */
export const USD_PRO_YEARLY_SAVINGS = 24;
export const USD_PER_EMPLOYEE_YEARLY_SAVINGS = 24;
export const MARKETING_PLANS = [
    { code: 'basic', name: 'BASIC', priceCents: 0, monthlyPriceCents: 0, period: 'forever' },
    {
        code: 'pro',
        name: 'PRO',
        priceCents: USD_PRO_YEAR * 100,
        monthlyPriceCents: USD_PRO_MONTH * 100,
        period: 'year',
    },
    {
        code: 'business',
        name: 'BUSINESS',
        priceCents: USD_PER_EMPLOYEE_YEAR * 100,
        monthlyPriceCents: USD_PER_EMPLOYEE_MONTH * 100,
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
export function matchesMarketingPrice(code, priceCents, monthlyPriceCents) {
    const catalog = marketingPlanByCode(code);
    if (!catalog)
        return null;
    const monthlyOk = monthlyPriceCents === undefined
        ? true
        : catalog.monthlyPriceCents === monthlyPriceCents;
    return catalog.priceCents === priceCents && monthlyOk;
}
export function yearlyOfferCopy(planCode, employees = 1) {
    const seats = Math.max(1, Math.floor(employees));
    if (planCode === 'pro') {
        return {
            title: `Save ${formatMarketingUsd(USD_PRO_YEARLY_SAVINGS)} with the yearly plan`,
            body: `Pay ${formatMarketingUsd(USD_PRO_YEAR)} once for the year instead of ${formatMarketingUsd(USD_PRO_MONTH * 12)} on monthly billing. That's ${formatMarketingUsd(USD_PRO_YEAR / 12)} a month.`,
            yearlyCta: `Subscribe yearly, ${formatMarketingUsd(USD_PRO_YEAR)}`,
            monthlyCta: `Continue monthly, ${formatMarketingUsd(USD_PRO_MONTH)} / month`,
        };
    }
    const totalSave = USD_PER_EMPLOYEE_YEARLY_SAVINGS * seats;
    return {
        title: `Save ${formatMarketingUsd(USD_PER_EMPLOYEE_YEARLY_SAVINGS)} per employee with the yearly plan`,
        body: `Pay ${formatMarketingUsd(USD_PER_EMPLOYEE_YEAR)} per employee once for the year instead of ${formatMarketingUsd(USD_PER_EMPLOYEE_MONTH * 12)} on monthly billing. That's ${formatMarketingUsd(USD_PER_EMPLOYEE_YEAR / 12)} a month per employee.${seats > 1 ? ` Total saving for ${seats} employees: ${formatMarketingUsd(totalSave)} a year.` : ''}`,
        yearlyCta: `Subscribe yearly${seats > 1 ? ` (${formatMarketingUsd(USD_PER_EMPLOYEE_YEAR * seats)} total)` : `, ${formatMarketingUsd(USD_PER_EMPLOYEE_YEAR)}`}`,
        monthlyCta: `Continue monthly, ${formatMarketingUsd(USD_PER_EMPLOYEE_MONTH)} / employee / month`,
    };
}
export function resolvePlanPrices(code, catalog) {
    const marketing = marketingPlanByCode(code);
    const yearlyCents = catalog && Number.isFinite(catalog.priceCents)
        ? catalog.priceCents
        : marketing?.priceCents ?? 0;
    const monthlyCents = catalog && Number.isFinite(catalog.monthlyPriceCents)
        ? catalog.monthlyPriceCents
        : marketing?.monthlyPriceCents ?? 0;
    return { yearlyCents, monthlyCents };
}
