export declare const RATING_COMMENT_MAX_CHARS = 150;
export declare const PLAN_GIVEN_CAPS: {
    readonly basic: 25;
    readonly pro: 60;
    readonly business: 50;
};
export declare const PLAN_THEME_ENTITLEMENTS: {
    readonly basic: {
        readonly namedPacks: 5;
        readonly customThemes: 0;
        readonly companyBrandedThemes: 0;
    };
    readonly pro: {
        readonly namedPacks: 10;
        readonly customThemes: 1;
        readonly companyBrandedThemes: 1;
    };
    readonly business: {
        readonly namedPacks: 10;
        readonly customThemes: 1;
        readonly companyBrandedThemes: 1;
    };
};
export declare const MOBILE_PLAN_DISPLAY: readonly [{
    readonly code: "basic";
    readonly name: "Basic";
    readonly priceLabel: string;
    readonly period: "Forever · No card needed";
    readonly highlight: false;
    readonly features: readonly ["Public verified profile", "Unlimited ratings received", "25 ratings given per month", "QR code profile sharing", "Basic reputation score", "5 card themes"];
}, {
    readonly code: "pro";
    readonly name: "Pro";
    readonly priceLabel: string;
    readonly period: `${string} / month or ${string} / year`;
    readonly highlight: true;
    readonly features: readonly ["Unlimited ratings received", "60 ratings given per month", "10 card themes", "One custom theme", "One company-branded theme", "Full category breakdown", "NFC tap sharing", "Professional Snapshot card", "Custom profile URL", "AI profile & theme assistant", "Priority dispute review"];
}, {
    readonly code: "business";
    readonly name: "Business";
    readonly priceLabel: string;
    readonly period: `${string} / employee / month or ${string} / employee / year`;
    readonly highlight: false;
    readonly features: readonly ["Unlimited ratings received", "50 ratings given per employee / month", "Expanded card themes", "Custom theme", "Company-branded theme", "Organization roster & invites", "Business workspace on the web", "Team reputation overview"];
}];
export type MobilePlanCode = (typeof MOBILE_PLAN_DISPLAY)[number]['code'];
export declare function plansForDisplay(apiPlans?: readonly {
    code: string;
    priceCents: number;
    monthlyPriceCents?: number;
    name?: string;
}[]): ({
    priceLabel: string;
    period: string;
    code: "basic";
    name: "Basic";
    highlight: false;
    features: readonly ["Public verified profile", "Unlimited ratings received", "25 ratings given per month", "QR code profile sharing", "Basic reputation score", "5 card themes"];
} | {
    priceLabel: string;
    period: string;
    code: "pro";
    name: "Pro";
    highlight: true;
    features: readonly ["Unlimited ratings received", "60 ratings given per month", "10 card themes", "One custom theme", "One company-branded theme", "Full category breakdown", "NFC tap sharing", "Professional Snapshot card", "Custom profile URL", "AI profile & theme assistant", "Priority dispute review"];
} | {
    priceLabel: string;
    period: string;
    code: "business";
    name: "Business";
    highlight: false;
    features: readonly ["Unlimited ratings received", "50 ratings given per employee / month", "Expanded card themes", "Custom theme", "Company-branded theme", "Organization roster & invites", "Business workspace on the web", "Team reputation overview"];
})[];
//# sourceMappingURL=mobile-plan-display.d.ts.map