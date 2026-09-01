import { Analytics } from '@vercel/analytics/next'
import {
  Figtree,
  IBM_Plex_Sans_Arabic,
  Newsreader,
  Noto_Naskh_Arabic,
  Noto_Sans_Arabic,
  Outfit,
  Syne,
} from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/product/providers'
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

export const metadata: Metadata = {
  title: 'RaytME — Virtual Business Card & Professional Reputation',
  description: 'Your RaytME profile is your virtual business card. Share it, connect instantly, and carry a portable professional reputation that stays current.',
  metadataBase: new URL('https://rate.me'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'RaytME — Virtual Business Card & Professional Reputation',
    description: 'Your RaytME profile is your virtual business card — with a reputation that travels.',
    url: 'https://rate.me',
    siteName: 'RaytME',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'RaytME — Virtual Business Card & Professional Reputation', description: 'Your RaytME profile is your virtual business card — with a reputation that travels.' },
  robots: { index: true, follow: true },
  keywords: ['virtual business card', 'professional reputation', 'professional ratings', 'RaytME', 'بطاقة عمل رقمية', 'سمعة مهنية'],
  generator: 'RaytME',
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
      className={`${outfit.variable} ${syne.variable} ${figtree.variable} ${newsreader.variable} ${plexArabic.variable} ${naskh.variable} ${notoArabic.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', name: 'RaytME', url: 'https://rate.me', description: 'Your virtual business card, with a portable professional reputation.' }, { '@type': 'SoftwareApplication', name: 'RaytME', applicationCategory: 'BusinessApplication', operatingSystem: 'iOS, Android, Web', description: 'A virtual business card and portable professional reputation profile you can share by link, QR, or email signature.' }, { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'What is RaytME?', acceptedAnswer: { '@type': 'Answer', text: 'RaytME is a verified professional reputation platform and virtual business card. It converts real professional interactions into a credibility-weighted reputation score, shareable via QR code, NFC, link, or email signature.' } }, { '@type': 'Question', name: 'Does RaytME sell my data?', acceptedAnswer: { '@type': 'Answer', text: 'No. RaytME does not sell user data or rating information.' } }, { '@type': 'Question', name: 'Can I dispute a rating?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Rated users can flag a rating for review and respond publicly.' } }] }] }) }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
