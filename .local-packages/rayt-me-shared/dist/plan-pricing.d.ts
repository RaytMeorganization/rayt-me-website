/** Canonical marketing prices — consumed by website, backend seed, and mobile. */
export declare const USD_PRO_YEAR = 48;
export declare const USD_PER_EMPLOYEE_YEAR = 36;
export declare const USD_PRO_MONTH = 6;
export declare const USD_PER_EMPLOYEE_MONTH = 5;
/** Savings when choosing yearly vs 12× monthly (USD). */
export declare const USD_PRO_YEARLY_SAVINGS = 24;
export declare const USD_PER_EMPLOYEE_YEARLY_SAVINGS = 24;
export type MarketingPlanCode = 'basic' | 'pro' | 'business';
export type MarketingPlanDefinition = {
    code: MarketingPlanCode;
    name: string;
    /** Yearly price in cents (one payment per year). */
    priceCents: number;
    /** Monthly price in cents (per billing period). */
    monthlyPriceCents: number;
    period: 'forever' | 'year' | 'employeeYear';
};
export declare const MARKETING_PLANS: MarketingPlanDefinition[];
export declare function marketingPlanByCode(code: string): MarketingPlanDefinition | undefined;
export declare function formatMarketingUsd(amount: number): string;
export declare function formatPriceCentsUsd(cents: unknown): string;
export declare function usdToCents(dollars: number): number;
export declare function centsToUsd(cents: number): number;
export declare function planPeriodLabel(period: MarketingPlanDefinition['period'], t: (key: 'pricePeriodForever' | 'pricePeriodYear' | 'pricePeriodEmployeeYear') => string): string;
export declare function matchesMarketingPrice(code: string, priceCents: number, monthlyPriceCents?: number): boolean | null;
export type BillingInterval = 'month' | 'year';
export type YearlyOfferCopy = {
    title: string;
    body: string;
    yearlyCta: string;
    monthlyCta: string;
};
export declare function yearlyOfferCopy(planCode: 'pro' | 'business', employees?: number): YearlyOfferCopy;
export type PublicPlanCatalogRow = {
    code: string;
    name: string;
    priceCents: number;
    monthlyPriceCents: number;
};
export declare function resolvePlanPrices(code: string, catalog?: PublicPlanCatalogRow | null): {
    yearlyCents: number;
    monthlyCents: number;
};
//# sourceMappingURL=plan-pricing.d.ts.map