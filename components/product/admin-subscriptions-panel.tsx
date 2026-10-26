'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecordShell, StatusBadge } from '@/components/product/dashboard-ui'
import { formatAdminDate, InteractiveLink } from '@/components/product/interactive-value'
import { useI18n } from '@/components/product/providers'
import { formatPriceCentsUsd } from '@/lib/plan-pricing'
import { AdminSubscriptionEditor, type SubscriptionChange } from '@/components/product/admin-subscription-editor'
import { paymentStatusLabel, paymentStatusTone, planLabel, subscriptionStatusLabel, subscriptionStatusTone } from '@/components/product/status-labels'

export type AdminSubscriptionsPayload = {
  summary: Record<string, number>
  organizationSubscriptions: Record<string, unknown>[]
}

export type AdminInvoiceRow = Record<string, unknown>

export function AdminSubscriptionsPanel({
  payload,
  invoices,
  invoiceMeta,
  busy,
  onSubscriptionChange,
  onInvoicePage,
}: {
  payload: AdminSubscriptionsPayload | null
  invoices: AdminInvoiceRow[]
  invoiceMeta: { total: number; page: number; limit: number } | null
  busy?: boolean
  onSubscriptionChange: (
    organizationId: string,
    data: SubscriptionChange,
  ) => void
  onInvoicePage: (page: number) => void
}) {
  const { t } = useI18n()
  const summary = payload?.summary ?? {}
  const subs = payload?.organizationSubscriptions ?? []

  const statKeys = [
    ['activeOrganizationSubscriptions', t('adminActiveSubscriptions')],
    ['trialingOrganizationSubscriptions', t('adminTrialingSubscriptions')],
    ['pastDueOrganizationSubscriptions', t('adminPastDueSubscriptions')],
    ['canceledOrganizationSubscriptions', t('adminCanceledSubscriptions')],
    ['tierBasic', t('tierBasic')],
    ['tierPro', t('tierPro')],
    ['tierBusiness', t('tierBusiness')],
  ] as const

  return (
    <div className="grid gap-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statKeys.map(([key, label]) =>
          summary[key] != null ? (
            <Card key={key} className="border-white/10 bg-card/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              </CardHeader>
              <CardContent className="font-serif text-2xl font-semibold">{summary[key]}</CardContent>
            </Card>
          ) : null,
        )}
      </div>

      <DashboardSection title={t('adminOrgSubscriptions')} description={t('adminOrgSubscriptionsHelp')}>
        {subs.length ? (
          <div className="grid gap-3">
            {subs.map((row) => {
              const org = row.organization as Record<string, unknown> | undefined
              const plan = row.plan as { code?: string; name?: string; priceCents?: number } | undefined
              const orgId = String(org?.id ?? '')
              const status = String(row.status ?? '')
              const planCode = String(plan?.code ?? 'business')
              const memberCount = (org?._count as { memberships?: number } | undefined)?.memberships
              return (
                <RecordShell
                  key={String(row.id)}
                  title={String(org?.name ?? t('organizations'))}
                  subtitle={org?.slug ? String(org.slug) : undefined}
                  badges={
                    <>
                      <StatusBadge tone={subscriptionStatusTone(status)}>
                        {subscriptionStatusLabel(t, status)}
                      </StatusBadge>
                      {plan?.code ? (
                        <Badge variant="outline" className="rounded-full">{planLabel(plan.code)}</Badge>
                      ) : null}
                      {memberCount != null ? (
                        <Badge variant="secondary" className="rounded-full">{memberCount} {t('members')}</Badge>
                      ) : null}
                    </>
                  }
                >
                  <AdminSubscriptionEditor
                    idPrefix={`sub-${String(row.id)}`}
                    planCode={planCode}
                    status={status}
                    seatQuantity={row.seatQuantity != null ? Number(row.seatQuantity) : null}
                    busy={busy || !orgId}
                    onSave={data => onSubscriptionChange(orgId, data)}
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t('periodEnd')}: {formatAdminDate(row.currentPeriodEnd)}
                    {plan?.priceCents != null ? ` · ${formatPriceCentsUsd(plan.priceCents)}${plan.code === 'business' ? ` / ${t('perEmployeeYear')}` : ''}` : ''}
                  </p>
                </RecordShell>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('adminNoOrgSubscriptions')}</p>
        )}
      </DashboardSection>

      <DashboardSection title={t('adminSalesInvoices')} description={t('adminSalesInvoicesHelp')}>
        {invoices.length ? (
          <div className="grid gap-2">
            {invoices.map((row) => {
              const user = row.user as Record<string, unknown> | undefined
              const userId = user?.id ? String(user.id) : ''
              return (
                <RecordShell
                  key={String(row.id)}
                  title={String(user?.name || user?.email || row.id)}
                  subtitle={String(user?.email || '')}
                  badges={
                    <StatusBadge tone={paymentStatusTone(String(row.status ?? ''))}>
                      {paymentStatusLabel(t, String(row.status ?? ''))}
                    </StatusBadge>
                  }
                >
                  <p className="text-sm text-muted-foreground">
                    {planLabel(String(row.planCode ?? ''))} · {formatPriceCentsUsd(Number(row.amountCents ?? 0))} · {formatAdminDate(row.paidAt || row.createdAt)}
                  </p>
                  {row.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">{String(row.description)}</p>
                  ) : null}
                  {userId ? (
                    <p className="mt-2 text-xs">
                      <InteractiveLink href={`/p/${encodeURIComponent(userId)}`}>
                        {t('viewPublicCard')}
                      </InteractiveLink>
                    </p>
                  ) : null}
                </RecordShell>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t('adminNoInvoices')}</p>
        )}
        {invoiceMeta && invoiceMeta.total > invoiceMeta.limit ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {t('pageOf')
                .replace('{page}', String(invoiceMeta.page))
                .replace('{pages}', String(Math.max(1, Math.ceil(invoiceMeta.total / invoiceMeta.limit))))}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy || invoiceMeta.page <= 1}
                onClick={() => onInvoicePage(Math.max(1, invoiceMeta.page - 1))}
              >
                {t('previous')}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy || invoiceMeta.page >= Math.ceil(invoiceMeta.total / invoiceMeta.limit)}
                onClick={() => onInvoicePage(invoiceMeta.page + 1)}
              >
                {t('next')}
              </Button>
            </div>
          </div>
        ) : null}
      </DashboardSection>
    </div>
  )
}

function DashboardSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="grid gap-3">
      <div>
        <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}
