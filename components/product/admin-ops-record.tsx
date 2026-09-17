'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RecordShell, StatusBadge } from '@/components/product/dashboard-ui'
import { FieldGrid, FieldItem } from '@/components/product/dashboard-ui'
import { AdminFieldValue } from '@/components/product/admin-field-value'
import { CopyableText, formatAdminDate, InteractiveLink } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'

function personLabel(person: unknown): string {
  if (!person || typeof person !== 'object') return '—'
  const row = person as { name?: string; email?: string; id?: string }
  return row.name || row.email || row.id || '—'
}

function personId(person: unknown): string | null {
  if (!person || typeof person !== 'object') return null
  const id = (person as { id?: string }).id
  return id ? String(id) : null
}

function asNumber(value: unknown): string {
  if (value == null) return '—'
  const n = Number(value)
  return Number.isFinite(n) ? n.toFixed(2) : String(value)
}

export function AdminRatingRecord({
  item,
  mode,
  busy,
  onModerate,
  onDispute,
}: {
  item: Record<string, unknown>
  mode: 'ratings' | 'disputes'
  busy?: boolean
  onModerate?: (hidden: boolean) => void
  onDispute?: (status: 'resolved' | 'dismissed', reply?: string) => void
}) {
  const { t } = useI18n()
  const [reply, setReply] = useState('')
  const target = item.target
  const targetId = personId(target)
  const rater = item.rater
  const title = personLabel(target)
  const subtitle = personLabel(rater)

  return (
    <RecordShell
      title={title}
      subtitle={`${t('rater')}: ${subtitle}`}
      badges={
        mode === 'disputes' ? (
          <StatusBadge tone="warn">{String(item.disputeStatus || 'flagged')}</StatusBadge>
        ) : item.isHidden ? (
          <Badge variant="outline" className="rounded-full">{t('hideRating')}</Badge>
        ) : null
      }
    >
      <div className="flex w-full min-w-0 flex-col gap-4 lg:max-w-3xl">
        <FieldGrid>
          <FieldItem label={t('reputation')} value={<span className="font-mono tabular-nums">{asNumber(item.r)}</span>} />
          <FieldItem label={t('role')} value={<span>{String(item.relationship || '—')}</span>} />
          <FieldItem
            label={t('ratings')}
            value={item.id ? <CopyableText value={String(item.id)} /> : <>—</>}
          />
          <FieldItem label={t('status')} value={<AdminFieldValue fieldKey="disputeStatus" value={item.disputeStatus ?? 'none'} />} />
          {item.attributionTitle ? (
            <FieldItem
              label={t('attributionTitle')}
              value={
                <span className="text-sm">
                  {String(item.attributionTitle)}
                  {item.attributionPrivate ? ` · ${t('attributionPrivate')}` : ''}
                </span>
              }
            />
          ) : null}
          {item.comment ? (
            <FieldItem label={t('description')} value={<span className="text-sm">{String(item.comment)}</span>} />
          ) : null}
          {item.disputeReply ? (
            <FieldItem label={t('resolve')} value={<span className="text-sm">{String(item.disputeReply)}</span>} />
          ) : null}
          <FieldItem label={t('createdAt')} value={<span>{formatAdminDate(item.createdAt)}</span>} />
        </FieldGrid>
        {targetId ? (
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <CopyableText value={targetId} />
            <InteractiveLink href={`/p/${targetId}`}>{t('viewPublicCard')}</InteractiveLink>
          </div>
        ) : null}
        {mode === 'ratings' && onModerate && item.id ? (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => onModerate(!Boolean(item.isHidden))}>
            {Boolean(item.isHidden) ? t('showRating') : t('hideRating')}
          </Button>
        ) : null}
        {mode === 'disputes' && onDispute && item.id ? (
          <div className="grid gap-2">
            <Input
              value={reply}
              onChange={event => setReply(event.target.value)}
              placeholder={t('disputeReplyPrompt')}
              className="bg-input/30"
            />
            <div className="flex gap-2">
              <Button size="sm" disabled={busy} onClick={() => onDispute('resolved', reply)}>{t('resolve')}</Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => onDispute('dismissed')}>{t('dismiss')}</Button>
            </div>
          </div>
        ) : null}
      </div>
    </RecordShell>
  )
}

export function AdminCommunityReportRecord({
  item,
  busy,
  onResolve,
}: {
  item: Record<string, unknown>
  busy?: boolean
  onResolve?(status: 'resolved' | 'dismissed', reply?: string): void
}) {
  const { t } = useI18n()
  const [reply, setReply] = useState('')
  const target = item.target
  const reporter = item.reporter
  const community = item.community as { country?: string; professionKey?: string } | undefined
  const title = personLabel(target)
  const subtitle = personLabel(reporter)

  return (
    <RecordShell
      title={title}
      subtitle={`${t('communityReport')}: ${subtitle}`}
      badges={<StatusBadge tone="warn">{String(item.status || 'flagged')}</StatusBadge>}
    >
      <div className="flex w-full min-w-0 flex-col gap-4 lg:max-w-3xl">
        <FieldGrid>
          <FieldItem label={t('country')} value={<span>{String(community?.country || '—')}</span>} />
          <FieldItem label={t('professionGroup')} value={<span>{String(community?.professionKey || '—')}</span>} />
          <FieldItem label={t('description')} value={<span className="text-sm">{String(item.reason || '—')}</span>} />
          <FieldItem label={t('createdAt')} value={<span>{formatAdminDate(item.createdAt)}</span>} />
        </FieldGrid>
        {onResolve && item.id ? (
          <div className="grid gap-2">
            <Input
              value={reply}
              onChange={event => setReply(event.target.value)}
              placeholder={t('disputeReplyPrompt')}
              className="bg-input/30"
            />
            <div className="flex gap-2">
              <Button size="sm" disabled={busy} onClick={() => onResolve('resolved', reply)}>{t('resolve')}</Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => onResolve('dismissed')}>{t('dismiss')}</Button>
            </div>
          </div>
        ) : null}
      </div>
    </RecordShell>
  )
}

export function AdminAuditRecord({ item }: { item: Record<string, unknown> }) {
  const { t } = useI18n()
  const actor = item.actor as Record<string, unknown> | undefined
  const actorEmail = actor?.email ? String(actor.email) : null
  const title = String(item.action || t('audit'))
  const subtitle = actorEmail || personLabel(actor)

  return (
    <RecordShell title={title} subtitle={subtitle !== '—' ? subtitle : undefined}>
      <div className="flex w-full min-w-0 flex-col gap-3 lg:max-w-3xl">
        {actorEmail ? (
          <InteractiveLink href={`mailto:${actorEmail}`}>{actorEmail}</InteractiveLink>
        ) : null}
        <FieldGrid>
          <FieldItem label={t('role')} value={<span>{String(item.resourceType || '—')}</span>} />
          <FieldItem
            label={t('code')}
            value={item.resourceId ? <CopyableText value={String(item.resourceId)} /> : <>—</>}
          />
          <FieldItem label={t('createdAt')} value={<span>{formatAdminDate(item.createdAt)}</span>} />
        </FieldGrid>
        {item.metadata && typeof item.metadata === 'object' ? (
          <FieldItem
            label={t('entitlements')}
            value={<AdminFieldValue fieldKey="metadata" value={item.metadata} />}
          />
        ) : null}
      </div>
    </RecordShell>
  )
}
