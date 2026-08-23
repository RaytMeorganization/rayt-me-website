import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { Providers } from '@/components/product/providers'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic' })

export const metadata: Metadata = {
  title: 'Rayt Me — Verified Professional Reputation',
  description: 'Build a verified professional reputation from real professional interactions. Share your Rayt Me profile anywhere through QR, NFC, links, and email.',
  metadataBase: new URL('https://rate.me'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Rayt Me — Verified Professional Reputation',
    description: 'Build a verified professional reputation from real professional interactions.',
    url: 'https://rate.me',
    siteName: 'Rayt Me',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Rayt Me — Verified Professional Reputation', description: 'A professional reputation profile built from credible evidence.' },
  robots: { index: true, follow: true },
  keywords: ['professional reputation', 'verified profile', 'professional ratings', 'Rayt Me', 'سمعة مهنية', 'ملف مهني موثق'],
  generator: 'Rayt Me',
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
  colorScheme: 'light',
  themeColor: '#f7f8f4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" className={`${geist.variable} ${geistMono.variable} ${notoArabic.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'Organization', name: 'Rayt Me', url: 'https://rate.me', description: 'Verified professional reputation, wherever you go.' }, { '@type': 'SoftwareApplication', name: 'Rayt Me', applicationCategory: 'BusinessApplication', operatingSystem: 'iOS, Android, Web', description: 'A professional reputation profile built from verified identity and credible real-world interactions.' }, { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'What is Rayt Me?', acceptedAnswer: { '@type': 'Answer', text: 'Rayt Me is a portable professional reputation profile built from verified identity and credible professional interactions.' } }, { '@type': 'Question', name: 'Can I dispute a rating?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Rated users can flag a rating for review and respond publicly.' } }] }] }) }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
