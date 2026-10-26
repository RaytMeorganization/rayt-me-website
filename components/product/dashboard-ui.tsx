'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { useI18n } from '@/components/product/providers'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function WorkspaceTabs<T extends string>({
  tabs,
  value,
  onChange,
  ariaLabel,
}: {
  tabs: { id: T; label: string; icon?: LucideIcon }[]
  value: T
  onChange: (id: T) => void
  ariaLabel: string
}) {
  const { t } = useI18n()
  const scroller = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ back: false, forward: false })

  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    // RTL scrollLeft is 0 at the start and negative towards the end in modern browsers.
    const pos = Math.abs(el.scrollLeft)
    const max = el.scrollWidth - el.clientWidth
    setEdges({ back: pos > 2, forward: pos < max - 2 })
  }, [])

  useEffect(() => {
    measure()
    const el = scroller.current
    if (!el) return
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [measure, tabs.length])

  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [value])

  function scrollTabs(direction: 1 | -1) {
    const el = scroller.current
    if (!el) return
    const rtl = getComputedStyle(el).direction === 'rtl'
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * el.clientWidth * 0.7, behavior: 'smooth' })
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex(tab => tab.id === value)
    const rtl = scroller.current ? getComputedStyle(scroller.current).direction === 'rtl' : false
    const next = rtl ? 'ArrowLeft' : 'ArrowRight'
    const prev = rtl ? 'ArrowRight' : 'ArrowLeft'
    let target = -1
    if (event.key === next) target = (index + 1) % tabs.length
    else if (event.key === prev) target = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = tabs.length - 1
    if (target < 0) return
    event.preventDefault()
    onChange(tabs[target].id)
    requestAnimationFrame(() => {
      scroller.current?.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus()
    })
  }

  const arrowClass =
    'absolute top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-background/90 text-foreground shadow-md backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  return (
    <div className="relative mt-8">
      <div
        ref={scroller}
        onScroll={measure}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        role="tablist"
        className="flex gap-2 overflow-x-auto scroll-px-10 px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map(tab => {
          const active = tab.id === value
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(tab.id)}
              aria-selected={active}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground',
              )}
            >
              {Icon ? <Icon className="size-4 opacity-80" aria-hidden /> : null}
              {tab.label}
            </button>
          )
        })}
      </div>
      {edges.back ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-gradient-to-r from-background to-transparent rtl:bg-gradient-to-l" />
          <button type="button" tabIndex={-1} aria-label={t('tabsScrollBack')} onClick={() => scrollTabs(-1)} className={cn(arrowClass, 'start-0')}>
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        </>
      ) : null}
      {edges.forward ? (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-gradient-to-l from-background to-transparent rtl:bg-gradient-to-r" />
          <button type="button" tabIndex={-1} aria-label={t('tabsScrollForward')} onClick={() => scrollTabs(1)} className={cn(arrowClass, 'end-0')}>
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  )
}

export function DashboardSurface({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card
      className={cn(
        'mt-5 border-white/10 bg-card/90 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.85)] backdrop-blur-xl',
        className,
      )}
    >
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 border-b border-white/5">
        <div>
          <CardTitle className="font-serif text-xl font-semibold tracking-tight">{title}</CardTitle>
          {description ? <CardDescription className="mt-1 max-w-2xl">{description}</CardDescription> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  )
}

export function LoadingBlock({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-busy="true" className="grid gap-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-xl bg-muted/40" />
      ))}
    </div>
  )
}

export function ErrorBanner({
  message,
  onRetry,
  retryLabel,
}: {
  message: string
  onRetry?: () => void
  retryLabel: string
}) {
  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      <p>{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-3 border-destructive/30" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

export function RecordShell({
  title,
  subtitle,
  badges,
  children,
}: {
  title: string
  subtitle?: string
  badges?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <Card className="border-white/10 bg-muted/20 shadow-none ring-1 ring-white/5">
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-foreground">{title}</h3>
            {badges}
          </div>
          {subtitle ? <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {children ? <div className="min-w-0 w-full">{children}</div> : null}
      </CardContent>
    </Card>
  )
}

export function StatusBadge({ tone, children }: { tone: 'ok' | 'warn' | 'muted' | 'danger'; children: React.ReactNode }) {
  const variant = tone === 'danger' ? 'destructive' : tone === 'warn' ? 'secondary' : tone === 'ok' ? 'default' : 'outline'
  return <Badge variant={variant}>{children}</Badge>
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return <dl className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">{children}</dl>
}

export function FieldItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm text-foreground">{value}</dd>
    </div>
  )
}

export function InlineDivider() {
  return <Separator className="my-4 bg-white/10" />
}
