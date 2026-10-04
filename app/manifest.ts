import type { MetadataRoute } from 'next'

import { SITE_ORIGIN } from '@/lib/site'

/** Web app manifest — site name and icons for browsers (Google starter: organize & identify site). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RaytME — Virtual Business Card & Professional Reputation',
    short_name: 'RaytME',
    description:
      'Portable professional reputation and virtual business card — share by link, QR, or NFC.',
    start_url: '/',
    scope: '/',
    id: '/',
    display: 'standalone',
    background_color: '#0c0912',
    theme_color: '#0c0912',
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    related_applications: [
      {
        platform: 'web',
        url: SITE_ORIGIN,
      },
    ],
  }
}
