/** Canonical marketing prices — consumed by website, backend seed, and mobile. */
export declare const USD_PRO_YEAR = 27;
export declare const USD_PER_EMPLOYEE_YEAR = 21;
export type MarketingPlanCode = 'basic' | 'pro' | 'business';
export type MarketingPlanDefinition = {
    code: MarketingPlanCode;
    name: string;
    priceCents: number;
    period: 'forever' | 'year' | 'employeeYear';
};
export declare const MARKETING_PLANS: MarketingPlanDefinition[];
export declare function marketingPlanByCode(code: string): MarketingPlanDefinition | undefined;
export declare function formatMarketingUsd(amount: number): string;
export declare function formatPriceCentsUsd(cents: unknown): string;
export declare function usdToCents(dollars: number): number;
export declare function centsToUsd(cents: number): number;
export declare function planPeriodLabel(period: MarketingPlanDefinition['period'], t: (key: 'pricePeriodForever' | 'pricePeriodYear' | 'pricePeriodEmployeeYear') => string): string;
export declare function matchesMarketingPrice(code: string, priceCents: number): boolean | null;
//# sourceMappingURL=plan-pricing.d.ts.map