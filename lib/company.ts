/** Public company identity for the website, App Store, and Google Play. */

export const COMPANY = {
  legalName: 'RAYTME LLC',
  displayName: 'RaytME LLC',
  brand: 'RaytME',
  entityType: 'Wyoming limited liability company',
  addressLine1: '30 N Gould St, Ste R',
  city: 'Sheridan',
  region: 'WY',
  postalCode: '82801',
  country: 'United States',
  address: '30 N Gould St, Ste R, Sheridan, WY 82801',
  site: 'https://raytme.me',
  emails: {
    privacy: 'privacy@raytme.me',
    security: 'security@raytme.me',
    legal: 'legal@raytme.me',
    support: 'support@raytme.me',
    info: 'info@raytme.me',
  },
} as const

export const STORE_URLS = {
  privacy: 'https://raytme.me/privacy',
  terms: 'https://raytme.me/terms',
  acceptableUse: 'https://raytme.me/acceptable-use',
  support: 'https://raytme.me/support',
} as const

export const LEGAL_NAV = [
  { href: '/privacy', label: 'Privacy Notice', labelAr: 'إشعار الخصوصية' },
  { href: '/terms', label: 'Terms of Service', labelAr: 'شروط الخدمة' },
  { href: '/acceptable-use', label: 'Acceptable Use', labelAr: 'سياسة الاستخدام المقبول' },
  { href: '/support', label: 'Support', labelAr: 'الدعم' },
] as const

export const SITE_FOOTER_NAV = [
  {
    head: 'Product',
    headAr: 'المنتج',
    links: [
      { label: 'How it Works', labelAr: 'كيف تعمل', href: '/#how', landingHref: '#how' },
      { label: 'Communities', labelAr: 'المجتمعات', href: '/#communities', landingHref: '#communities' },
      { label: 'Pricing', labelAr: 'الأسعار', href: '/#pricing', landingHref: '#pricing' },
      { label: 'For Teams', labelAr: 'للفرق', href: '/#business', landingHref: '#business' },
    ],
  },
  {
    head: 'Company',
    headAr: 'الشركة',
    links: [
      { label: 'About Us', labelAr: 'من نحن', href: '/#about', landingHref: '#about' },
      { label: 'Contact', labelAr: 'تواصل', href: '/support', landingHref: '/support' },
    ],
  },
  {
    head: 'Resources',
    headAr: 'الموارد',
    links: [
      { label: 'Legal', labelAr: 'القانونية', href: '/legal', landingHref: '/legal' },
      { label: 'Privacy', labelAr: 'الخصوصية', href: '/privacy', landingHref: '/privacy' },
      { label: 'Terms', labelAr: 'الشروط', href: '/terms', landingHref: '/terms' },
      { label: 'Acceptable Use', labelAr: 'الاستخدام المقبول', href: '/acceptable-use', landingHref: '/acceptable-use' },
      { label: 'Support', labelAr: 'الدعم', href: '/support', landingHref: '/support' },
    ],
  },
] as const

export const LEGAL_SLIDES = [
  { href: '/legal', label: 'Legal', labelAr: 'القانونية' },
  ...LEGAL_NAV,
] as const

export function legalNeighbors(href: string) {
  const index = LEGAL_SLIDES.findIndex((item) => item.href === href)
  const current = index < 0 ? 0 : index
  return {
    slides: LEGAL_SLIDES,
    index: current,
    current: LEGAL_SLIDES[current],
    prevHref: current <= 0 ? '/' : LEGAL_SLIDES[current - 1].href,
    nextHref: current >= LEGAL_SLIDES.length - 1 ? '/' : LEGAL_SLIDES[current + 1].href,
    isFirst: current <= 0,
    isLast: current >= LEGAL_SLIDES.length - 1,
  }
}
