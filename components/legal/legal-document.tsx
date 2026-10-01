'use client'

import { Fragment, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, HomeIcon } from 'lucide-react'
import { LogoLockup } from '@/components/brand/logo-lockup'
import { LocaleButton } from '@/components/product/shell'
import { useI18n } from '@/components/product/providers'
import { LegalDeviceStage } from '@/components/rate-me/hero-stage'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { COMPANY, LEGAL_NAV, legalNeighbors } from '@/lib/company'
import {
  acceptableUse,
  privacyNotice,
  termsOfService,
  type LegalBlock,
  type LegalDocument,
} from '@/lib/legal-docs'
import { cn } from '@/lib/utils'

const CHROME = {
  en: {
    lastUpdated: 'Last updated',
    controlling: 'English is the controlling version.',
    back: 'Back',
    next: 'Next',
    home: 'Home',
    legal: 'Legal',
    legalIntro: `${COMPANY.displayName} (${COMPANY.legalName}), a ${COMPANY.entityType}. Seller name on the App Store and Google Play: ${COMPANY.legalName}.`,
    slideOf: (current: number, total: number) => `${current} of ${total}`,
    supportTitle: 'Support',
    supportIntro: `${COMPANY.displayName} operates the RaytME website and iOS/Android apps. Use this page for App Store and Google Play support, privacy requests, and safety reports.`,
  },
  ar: {
    lastUpdated: 'آخر تحديث',
    controlling: 'النسخة الإنجليزية هي النسخة المعتمدة.',
    back: 'السابق',
    next: 'التالي',
    home: 'الرئيسية',
    legal: 'القانونية',
    legalIntro: `${COMPANY.displayName} (${COMPANY.legalName})، وهي ${COMPANY.entityType}. اسم البائع في App Store وGoogle Play: ${COMPANY.legalName}.`,
    slideOf: (current: number, total: number) => `${current} من ${total}`,
    supportTitle: 'الدعم',
    supportIntro: `${COMPANY.displayName} تشغّل موقع RaytME وتطبيقي iOS وAndroid. استخدم هذه الصفحة لدعم App Store وGoogle Play وطلبات الخصوصية وبلاغات السلامة.`,
  },
} as const

const SUPPORT_CONTACTS = [
  {
    label: 'App support',
    labelAr: 'دعم التطبيق',
    email: COMPANY.emails.support,
    help: 'Account help, ratings, and safety reports',
    helpAr: 'مساعدة الحساب والتقييمات وبلاغات السلامة',
  },
  {
    label: 'Privacy',
    labelAr: 'الخصوصية',
    email: COMPANY.emails.privacy,
    help: 'Access, correction, export, and deletion requests',
    helpAr: 'طلبات الوصول والتصحيح والتصدير والحذف',
  },
  {
    label: 'Security',
    labelAr: 'الأمن',
    email: COMPANY.emails.security,
    help: 'Unauthorized access and vulnerability reports',
    helpAr: 'بلاغات الوصول غير المصرّح به والثغرات',
  },
  {
    label: 'Legal',
    labelAr: 'الشؤون القانونية',
    email: COMPANY.emails.legal,
    help: 'Formal notices and takedown requests',
    helpAr: 'الإشعارات الرسمية وطلبات الإزالة',
  },
] as const

function useArabic() {
  const { locale } = useI18n()
  return locale === 'ar'
}

function Block({ block }: { block: LegalBlock }) {
  if (block.type === 'h') {
    return <h2 className="pt-2 text-lg font-medium tracking-tight">{block.text}</h2>
  }
  if (block.type === 'ul') {
    return (
      <ul className="flex list-disc flex-col gap-2 ps-5 leading-7">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }
  if (block.type === 'table') {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {block.headers.map((header) => (
              <TableHead key={header} className="whitespace-normal">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {block.rows.map((row) => (
            <TableRow key={row.join('|')}>
              {row.map((cell) => (
                <TableCell key={cell} className="whitespace-normal leading-6 text-muted-foreground">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  return <p className="whitespace-pre-line leading-7 text-muted-foreground">{block.text}</p>
}

function CompanyFooter() {
  return (
    <CardFooter className="flex-col items-start gap-1">
      <p dir="ltr">
        {COMPANY.displayName} · {COMPANY.address}
      </p>
      <a className="underline underline-offset-4" href={`mailto:${COMPANY.emails.info}`}>
        {COMPANY.emails.info}
      </a>
    </CardFooter>
  )
}

function SlideCard({ children }: { children: ReactNode }) {
  return (
    <Card className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      <CompanyFooter />
    </Card>
  )
}

function HubSlide({ arabic }: { arabic: boolean }) {
  const copy = arabic ? CHROME.ar : CHROME.en
  return (
    <SlideCard>
      <CardHeader className="border-b">
        <CardTitle className="font-serif text-3xl leading-tight">{copy.legal}</CardTitle>
        <CardDescription>{copy.legalIntro}</CardDescription>
      </CardHeader>
      <CardContent>
        <nav aria-label={copy.legal} className="flex flex-col">
          {LEGAL_NAV.map((item, index) => (
            <Fragment key={item.href}>
              {index > 0 ? <Separator /> : null}
              <Link
                href={item.href}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'h-auto w-full justify-between rounded-none px-0 py-4',
                )}
              >
                <span className="flex min-w-0 flex-col items-start gap-0.5">
                  <span>{arabic ? item.labelAr : item.label}</span>
                  <span className="text-muted-foreground">{arabic ? item.label : item.labelAr}</span>
                </span>
                <ChevronRightIcon data-icon="inline-end" className="rtl:rotate-180" />
              </Link>
            </Fragment>
          ))}
        </nav>
      </CardContent>
    </SlideCard>
  )
}

function DocumentSlide({ doc, arabic }: { doc: LegalDocument; arabic: boolean }) {
  const copy = arabic ? CHROME.ar : CHROME.en
  const blocks = arabic ? doc.blocksAr : doc.blocks
  return (
    <SlideCard>
      <CardHeader className="border-b">
        <CardDescription>
          {copy.lastUpdated} {arabic ? doc.lastUpdatedAr : doc.lastUpdated}
        </CardDescription>
        <CardTitle className="font-serif text-3xl leading-tight">
          {arabic ? doc.titleAr : doc.title}
        </CardTitle>
        <Badge variant="secondary">{copy.controlling}</Badge>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <div className="flex flex-col gap-4">
          {blocks.map((block, index) => (
            <Block key={`${doc.slug}-${index}`} block={block} />
          ))}
        </div>
      </CardContent>
    </SlideCard>
  )
}

function SupportSlide({ arabic }: { arabic: boolean }) {
  const copy = arabic ? CHROME.ar : CHROME.en
  return (
    <SlideCard>
      <CardHeader className="border-b">
        <CardTitle className="font-serif text-3xl leading-tight">{copy.supportTitle}</CardTitle>
        <CardDescription>{copy.supportIntro}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-4 pb-6">
        <p className="text-sm text-muted-foreground" dir="ltr">
          {COMPANY.legalName}
          <br />
          {COMPANY.address}
        </p>
        <nav className="flex flex-col">
          {SUPPORT_CONTACTS.map((item, index) => (
            <Fragment key={item.email}>
              {index > 0 ? <Separator /> : null}
              <div className="flex flex-col gap-1 py-4">
                <p className="font-medium">{arabic ? item.labelAr : item.label}</p>
                <p className="text-sm text-muted-foreground">{arabic ? item.helpAr : item.help}</p>
                <a className="text-sm underline underline-offset-4" href={`mailto:${item.email}`}>
                  {item.email}
                </a>
              </div>
            </Fragment>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground">
          {arabic ? (
            <>
              يمكنك تصدير حسابك أو حذفه في تطبيق RaytME من الإعدادات ← الحساب. اقرأ{' '}
              <Link className="underline underline-offset-4" href="/privacy">
                إشعار الخصوصية
              </Link>{' '}
              و{' '}
              <Link className="underline underline-offset-4" href="/terms">
                شروط الخدمة
              </Link>
              . {copy.controlling}
            </>
          ) : (
            <>
              You can export or delete your account in the RaytME app under Settings → Account. Read the{' '}
              <Link className="underline underline-offset-4" href="/privacy">
                Privacy Notice
              </Link>{' '}
              and{' '}
              <Link className="underline underline-offset-4" href="/terms">
                Terms of Service
              </Link>
              .
            </>
          )}
        </p>
      </CardContent>
    </SlideCard>
  )
}

function slideFor(href: string, arabic: boolean) {
  if (href === '/privacy') return <DocumentSlide doc={privacyNotice} arabic={arabic} />
  if (href === '/terms') return <DocumentSlide doc={termsOfService} arabic={arabic} />
  if (href === '/acceptable-use') return <DocumentSlide doc={acceptableUse} arabic={arabic} />
  if (href === '/support') return <SupportSlide arabic={arabic} />
  return <HubSlide arabic={arabic} />
}

function LegalPager({ activeHref }: { activeHref: string }) {
  const arabic = useArabic()
  const copy = arabic ? CHROME.ar : CHROME.en
  const { slides, index, prevHref, nextHref, isFirst, isLast } = legalNeighbors(activeHref)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      const goPrev = arabic ? event.key === 'ArrowRight' : event.key === 'ArrowLeft'
      const goNext = arabic ? event.key === 'ArrowLeft' : event.key === 'ArrowRight'
      if (goPrev) {
        event.preventDefault()
        document.querySelector<HTMLElement>('[data-legal-pager="prev"]')?.click()
      }
      if (goNext) {
        event.preventDefault()
        document.querySelector<HTMLElement>('[data-legal-pager="next"]')?.click()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [arabic])

  return (
    <nav aria-label={copy.legal} className="relative z-30 shrink-0 border-t border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Button
          nativeButton={false}
          render={<Link href={prevHref} data-legal-pager="prev" />}
          variant="outline"
        >
          <ChevronLeftIcon data-icon="inline-start" className="rtl:rotate-180" />
          {isFirst ? copy.home : copy.back}
        </Button>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">{copy.slideOf(index + 1, slides.length)}</p>
          <ol className="flex items-center justify-center gap-1.5">
            {slides.map((slide, slideIndex) => (
              <li key={slide.href}>
                <Link
                  href={slide.href}
                  aria-current={slide.href === activeHref ? 'page' : undefined}
                  aria-label={arabic ? slide.labelAr : slide.label}
                  className={
                    slideIndex === index
                      ? 'block size-2 rounded-full bg-foreground'
                      : 'block size-2 rounded-full bg-muted-foreground/40'
                  }
                />
              </li>
            ))}
          </ol>
        </div>
        <Button nativeButton={false} render={<Link href={nextHref} data-legal-pager="next" />}>
          {isLast ? copy.home : copy.next}
          <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
        </Button>
      </div>
    </nav>
  )
}

export function LegalChrome({ activeHref = '/legal' }: { activeHref?: string }) {
  const arabic = useArabic()
  const copy = arabic ? CHROME.ar : CHROME.en

  return (
    <div className="rate-landing rate-legal dark relative grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-black text-foreground">
      <header className="relative z-20 shrink-0 border-b border-white/10 bg-black/55 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href="/"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogoLockup tone="light" size="sm" />
            </Link>
            <Button nativeButton={false} render={<Link href="/" />} variant="outline" size="sm">
              <HomeIcon data-icon="inline-start" />
              {copy.home}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 lg:flex" aria-label={copy.legal}>
              {LEGAL_NAV.map((item) => (
                <Button
                  key={item.href}
                  nativeButton={false}
                  render={<Link href={item.href} />}
                  variant={activeHref === item.href ? 'secondary' : 'ghost'}
                  size="sm"
                >
                  {arabic ? item.labelAr : item.label}
                </Button>
              ))}
            </nav>
            <LocaleButton tone="dark" />
          </div>
        </div>
      </header>
      <main className="relative z-10 grid min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)] overflow-hidden px-4 py-4 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-6 lg:px-8">
        <section aria-label={copy.legal} className="flex h-full min-h-0 min-w-0 w-full flex-col">
          {slideFor(activeHref, arabic)}
        </section>
        <div className="hidden h-full min-h-0 items-center justify-center overflow-hidden lg:flex [&_[data-no-translate]]:overflow-visible">
          <div className="[zoom:0.68]">
            <LegalDeviceStage />
          </div>
        </div>
      </main>
      <LegalPager activeHref={activeHref} />
    </div>
  )
}

export function LegalDocumentPage({ doc }: { doc: LegalDocument }) {
  return <LegalChrome activeHref={`/${doc.slug}`} />
}

export function LegalHubPage() {
  return <LegalChrome activeHref="/legal" />
}

export function SupportLegalPage() {
  return <LegalChrome activeHref="/support" />
}
