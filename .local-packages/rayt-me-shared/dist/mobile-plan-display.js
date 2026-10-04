import { formatMarketingUsd, USD_PER_EMPLOYEE_MONTH, USD_PER_EMPLOYEE_YEAR, USD_PRO_MONTH, USD_PRO_YEAR, } from './plan-pricing.js';
export const RATING_COMMENT_MAX_CHARS = 150;
export const PLAN_GIVEN_CAPS = {
    basic: 25,
    pro: 60,
    business: 50,
};
export const PLAN_THEME_ENTITLEMENTS = {
    basic: { namedPacks: 5, customThemes: 0, companyBrandedThemes: 0 },
    pro: { namedPacks: 10, customThemes: 1, companyBrandedThemes: 1 },
    business: { namedPacks: 10, customThemes: 1, companyBrandedThemes: 1 },
};
export const MOBILE_PLAN_DISPLAY = [
    {
        code: 'basic',
        name: 'Basic',
        priceLabel: formatMarketingUsd(0),
        period: 'Forever · No card needed',
        highlight: false,
        features: [
            'Public verified profile',
            'Unlimited ratings received',
            '25 ratings given per month',
            'QR code profile sharing',
            'Basic reputation score',
            '5 card themes',
        ],
    },
    {
        code: 'pro',
        name: 'Pro',
        priceLabel: formatMarketingUsd(USD_PRO_YEAR),
        period: `${formatMarketingUsd(USD_PRO_MONTH)} / month or ${formatMarketingUsd(USD_PRO_YEAR)} / year`,
        highlight: true,
        features: [
            'Unlimited ratings received',
            '60 ratings given per month',
            '10 card themes',
            'One custom theme',
            'One company-branded theme',
            'Full category breakdown',
            'NFC tap sharing',
            'Professional Snapshot card',
            'Custom profile URL',
            'AI profile & theme assistant',
            'Priority dispute review',
        ],
    },
    {
        code: 'business',
        name: 'Business',
        priceLabel: formatMarketingUsd(USD_PER_EMPLOYEE_YEAR),
        period: `${formatMarketingUsd(USD_PER_EMPLOYEE_MONTH)} / employee / month or ${formatMarketingUsd(USD_PER_EMPLOYEE_YEAR)} / employee / year`,
        highlight: false,
        features: [
            'Unlimited ratings received',
            '50 ratings given per employee / month',
            'Expanded card themes',
            'Custom theme',
            'Company-branded theme',
            'Organization roster & invites',
            'Business workspace on the web',
            'Team reputation overview',
        ],
    },
];
export function plansForDisplay(apiPlans) {
    return MOBILE_PLAN_DISPLAY.map((plan) => {
        const remote = apiPlans?.find((entry) => entry.code === plan.code);
        if (!remote || !Number.isFinite(remote.priceCents)) {
            return { ...plan };
        }
        const yearly = formatMarketingUsd(remote.priceCents / 100);
        const monthly = remote.monthlyPriceCents && remote.monthlyPriceCents > 0
            ? formatMarketingUsd(remote.monthlyPriceCents / 100)
            : null;
        return {
            ...plan,
            priceLabel: yearly,
            period: monthly && plan.code !== 'basic'
                ? `${monthly} / month or ${yearly} / year`
                : plan.period,
        };
    });
}
