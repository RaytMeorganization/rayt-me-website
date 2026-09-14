'use client'

import { useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '@/components/product/providers'
import { formatPriceCentsUsd } from '@/lib/plan-pricing'

export function CopyableText({
  value,
  label,
  className,
  mono = true,
}: {
  value: string
  label?: string
  className?: string
  mono?: boolean
}) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      title={t('copyValue')}
      className={cn(
        'group inline-flex max-w-full items-center gap-2 rounded-lg border border-transparent px-1 py-0.5 text-left transition hover:border-white/10 hover:bg-white/5',
        className,
      )}
    >
      <span className={cn('truncate text-sm text-foreground', mono && 'font-mono text-xs')}>{value}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
      ) : (
        <Copy className="size-3.5 shrink-0 text-muted-foreground opacity-60 group-hover:opacity-100" aria-hidden />
      )}
      {label ? <span className="sr-only">{label}</span> : null}
    </button>
  )
}

export function InteractiveLink({
  href,
  children,
  external = false,
}: {
  href: string
  children: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
    >
      {children}
      {external ? <ExternalLink className="size-3.5 opacity-70" aria-hidden /> : null}
    </a>
  )
}

export function formatAdminDate(value: unknown) {
  if (!value) return '—'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function formatPriceCents(cents: unknown) {
  return formatPriceCentsUsd(cents)
}
