'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useI18n } from '@/components/product/providers'
import { yearlyOfferCopy, type BillingInterval } from '@/lib/plan-pricing'
import { cn } from '@/lib/utils'

const yearlyCtaClass =
  'min-h-11 w-full rounded-full bg-white px-4 text-sm font-medium text-black shadow-none hover:bg-white/90'
const monthlyCtaClass =
  'min-h-11 w-full rounded-full border-white/25 bg-white/[0.04] px-4 text-sm font-medium text-white hover:bg-white/10'

export function YearlyBillingOfferDialog({
  open,
  planCode,
  employees,
  onOpenChange,
  onChoose,
}: {
  open: boolean
  planCode: 'pro' | 'business'
  employees?: number
  onOpenChange: (open: boolean) => void
  onChoose: (interval: BillingInterval) => void
}) {
  const { t } = useI18n()
  const copy = yearlyOfferCopy(planCode, employees ?? 1)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        data-offer-card=""
        overlayClassName="offer-billing-overlay dark bg-black/70 backdrop-blur-md"
        className="dark rate-landing z-[101] gap-4 text-foreground"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="font-serif text-xl tracking-wide text-white">
            {copy.title}
          </SheetTitle>
          <SheetDescription className="text-sm leading-relaxed text-white/65">
            {copy.body}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl border border-violet-400/30 bg-violet-500/10 p-4">
            <Badge className="w-fit bg-violet-500 text-white">{t('billingYearly')}</Badge>
            <p className="text-sm leading-relaxed text-white/80">{t('billingOfferYearlyHelp')}</p>
            <Button type="button" className={cn(yearlyCtaClass, 'mt-auto')} onClick={() => onChoose('year')}>
              {copy.yearlyCta}
            </Button>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <Badge variant="outline" className="w-fit border-white/20 text-white/80">
              {t('billingMonthly')}
            </Badge>
            <p className="text-sm leading-relaxed text-white/65">{t('billingOfferMonthlyHelp')}</p>
            <Button
              type="button"
              variant="outline"
              className={cn(monthlyCtaClass, 'mt-auto')}
              onClick={() => onChoose('month')}
            >
              {copy.monthlyCta}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
