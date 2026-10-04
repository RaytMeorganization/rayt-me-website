import type { Metadata } from 'next'

import { LANDING_FAQ_ITEMS } from '@/lib/landing-faq'
import { SITE_ORIGIN, siteUrl } from '@/lib/site'

const DEFAULT_TITLE = 'RaytME — Virtual Business Card & Professional Reputation'
const DEFAULT_DESCRIPTION =
  'Your RaytME profile is your virtual business card. Share it, connect instantly, and carry a portable professional reputation that stays current.'

const OG_IMAGE_PATH = '/icon.svg'

function defaultOpenGraphImages() {
  const url = siteUrl(OG_IMAGE_PATH)
  return [{ url, width: 512, height: 512, alt: 'RaytME' }]
}

export const SITE_SEO_KEYWORDS = [
  'virtual business card',
  'professional reputation',
  'professional ratings',
  'credibility score',
  'digital business card',
  'QR business card',
  'NFC business card',
  'RaytME',
  'rate.me',
  'بطاقة عمل رقمية',
  'سمعة مهنية',
  'تقييم مهني',
] as const

function googleSiteVerification(): string | undefined {
  const raw =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
    process.env.GOOGLE_SITE_VERIFICATION?.trim()
  if (!raw) return undefined
  return raw.replace(/^google-site-verification=/i, '').trim()
}

/** Root metadata — safe defaults; optional GSC token via env only (no config file changes). */
export function buildRootMetadata(): Metadata {
  const google = googleSiteVerification()
  return {
    title: {
      default: DEFAULT_TITLE,
      template: '%s · RaytME',
    },
    description: DEFAULT_DESCRIPTION,
    metadataBase: new URL(SITE_ORIGIN),
    alternates: {
      canonical: '/',
      languages: {
        'en-US': siteUrl('/'),
        ar: siteUrl('/'),
      },
    },
    applicationName: 'RaytME',
    openGraph: {
      title: DEFAULT_TITLE,
      description: 'Your RaytME profile is your virtual business card — with a reputation that travels.',
      url: SITE_ORIGIN,
      siteName: 'RaytME',
      type: 'website',
      locale: 'en_US',
      alternateLocale: ['ar'],
      images: defaultOpenGraphImages(),
    },
    twitter: {
      card: 'summary_large_image',
      title: DEFAULT_TITLE,
      description: 'Your RaytME profile is your virtual business card — with a reputation that travels.',
      images: [siteUrl(OG_IMAGE_PATH)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    keywords: [...SITE_SEO_KEYWORDS],
    generator: 'RaytME',
    category: 'business',
    ...(google ? { verification: { google } } : {}),
  }
}

/** Landing page metadata (canonical + OG URL); does not change on-page copy. */
export function buildHomePageMetadata(): Metadata {
  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    alternates: { canonical: siteUrl('/') },
    openGraph: {
      url: siteUrl('/'),
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: defaultOpenGraphImages(),
    },
  }
}

export function buildPublicPageMetadata(options: {
  title: string
  description: string
  path: `/${string}`
}): Metadata {
  const canonical = siteUrl(options.path)
  return {
    title: options.title,
    description: options.description,
    alternates: { canonical },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonical,
      type: 'website',
      images: defaultOpenGraphImages(),
    },
    twitter: {
      card: 'summary',
      title: options.title,
      description: options.description,
    },
  }
}

export function buildRootJsonLdGraph() {
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_ORIGIN}/#faq`,
    mainEntity: LANDING_FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: 'RaytME',
        description: DEFAULT_DESCRIPTION,
        inLanguage: ['en', 'ar'],
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'RaytME',
        legalName: 'RAYTME LLC',
        url: SITE_ORIGIN,
        description: 'Your virtual business card, with a portable professional reputation.',
        logo: {
          '@type': 'ImageObject',
          url: siteUrl(OG_IMAGE_PATH),
        },
        sameAs: ['https://raytme.me'],
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}/#webpage`,
        url: SITE_ORIGIN,
        name: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#organization` },
        mainEntity: { '@id': `${SITE_ORIGIN}/#faq` },
        inLanguage: 'en',
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: siteUrl(OG_IMAGE_PATH),
        },
        hasPart: [
          {
            '@type': 'WebPageElement',
            isAccessibleForFree: true,
            name: 'Pricing',
            url: `${SITE_ORIGIN}/#pricing`,
          },
          {
            '@type': 'WebPageElement',
            isAccessibleForFree: true,
            name: 'FAQ',
            url: `${SITE_ORIGIN}/#faq`,
          },
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_ORIGIN}/#app`,
        name: 'RaytME',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'iOS, Android, Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free download; optional Pro and Business membership purchased on raytme.me (not in-app on mobile stores).',
        },
        description:
          'A virtual business card and portable professional reputation profile you can share by link, QR, or email signature.',
        url: SITE_ORIGIN,
        ...(process.env.NEXT_PUBLIC_APP_STORE_URL
          ? { downloadUrl: process.env.NEXT_PUBLIC_APP_STORE_URL }
          : {}),
      },
      faqPage,
    ],
  }
}
