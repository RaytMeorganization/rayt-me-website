export const QAR_PER_EMPLOYEE_YEAR = 60

export type CurrencyCode =
  | "QAR"
  | "AED"
  | "SAR"
  | "KWD"
  | "BHD"
  | "OMR"
  | "USD"
  | "EUR"
  | "GBP"
  | "SGD"
  | "AUD"

/** How many units of the local currency equal 1 QAR. */
const QAR_TO_LOCAL: Record<CurrencyCode, number> = {
  QAR: 1,
  AED: 1.01,
  SAR: 1.03,
  KWD: 0.084,
  BHD: 0.103,
  OMR: 0.106,
  USD: 0.275,
  EUR: 0.253,
  GBP: 0.216,
  SGD: 0.372,
  AUD: 0.421,
}

const TIMEZONE_CURRENCY: Record<string, CurrencyCode> = {
  "Asia/Qatar": "QAR",
  "Asia/Dubai": "AED",
  "Asia/Muscat": "OMR",
  "Asia/Riyadh": "SAR",
  "Asia/Kuwait": "KWD",
  "Asia/Bahrain": "BHD",
  "America/New_York": "USD",
  "America/Chicago": "USD",
  "America/Denver": "USD",
  "America/Los_Angeles": "USD",
  "America/Toronto": "USD",
  "Europe/London": "GBP",
  "Europe/Dublin": "EUR",
  "Europe/Paris": "EUR",
  "Europe/Berlin": "EUR",
  "Europe/Madrid": "EUR",
  "Europe/Rome": "EUR",
  "Europe/Amsterdam": "EUR",
  "Asia/Singapore": "SGD",
  "Australia/Sydney": "AUD",
  "Australia/Melbourne": "AUD",
}

const REGION_CURRENCY: Record<string, CurrencyCode> = {
  QA: "QAR",
  AE: "AED",
  SA: "SAR",
  KW: "KWD",
  BH: "BHD",
  OM: "OMR",
  US: "USD",
  CA: "USD",
  GB: "GBP",
  SG: "SGD",
  AU: "AUD",
  IE: "EUR",
  FR: "EUR",
  DE: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  PT: "EUR",
  BE: "EUR",
  AT: "EUR",
}

export function detectCurrencyCode(): CurrencyCode {
  if (typeof Intl === "undefined") return "USD"
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (timeZone && TIMEZONE_CURRENCY[timeZone]) return TIMEZONE_CURRENCY[timeZone]

  const locale =
    typeof navigator !== "undefined"
      ? navigator.language
      : Intl.DateTimeFormat().resolvedOptions().locale
  const region = locale?.split("-")[1]?.toUpperCase()
  if (region && REGION_CURRENCY[region]) return REGION_CURRENCY[region]
  return "USD"
}

export function unitPriceFor(currency: CurrencyCode) {
  return QAR_PER_EMPLOYEE_YEAR * QAR_TO_LOCAL[currency]
}

export function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount)
}
