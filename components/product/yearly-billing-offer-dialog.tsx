'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { yearlyOfferCopy, type BillingInterval } from '@/lib/plan-pricing'

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
  const copy = yearlyOfferCopy(planCode, employees ?? 1)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="border-white/10 bg-card/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl">{copy.title}</SheetTitle>
          <SheetDescription className="text-base leading-relaxed">{copy.body}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 grid gap-2">
          <Button type="button" className="min-h-11 w-full" onClick={() => onChoose('year')}>
            {copy.yearlyCta}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={() => onChoose('month')}
          >
            {copy.monthlyCta}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
