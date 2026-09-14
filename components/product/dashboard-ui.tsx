'use client'

import type { LucideIcon } from 'lucide-react'
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
  return (
    <nav aria-label={ariaLabel} className="mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map(tab => {
        const active = tab.id === value
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
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
    </nav>
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
      <CardContent className="flex flex-wrap items-start justify-between gap-4 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{title}</p>
            {badges}
          </div>
          {subtitle ? <p className="mt-1 truncate text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {children}
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
