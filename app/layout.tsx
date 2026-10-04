import {
  Figtree,
  IBM_Plex_Sans_Arabic,
  Newsreader,
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
  Outfit,
  Syne,
} from 'next/font/google'
import type { Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { Providers } from '@/components/product/providers'
import { RootJsonLd } from '@/components/seo/root-json-ld'
import { buildRootMetadata } from '@/lib/seo'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})
const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-syne',
})
const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
})
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
})
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600', '700'],
  variable: '--font-arabic',
})
const naskh = Noto_Naskh_Arabic({
  subsets: ['arabic'],
  weight: ['500', '700'],
  variable: '--font-arabic-display',
})
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic-ui' })

export const metadata = {
  ...buildRootMetadata(),
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0c0912',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${outfit.variable} ${syne.variable} ${figtree.variable} ${newsreader.variable} ${plexArabic.variable} ${naskh.variable} ${notoArabic.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
        <RootJsonLd />
        {process.env.NODE_ENV === 'production' ? <Analytics /> : null}
      </body>
    </html>
  )
}
