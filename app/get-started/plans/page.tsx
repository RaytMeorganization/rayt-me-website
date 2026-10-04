import { MarketingShell } from '@/components/product/marketing-shell'
import { GetStartedPlansPanel } from '@/components/product/get-started-plans-panel'

export default function GetStartedPlansPage() {
  return (
    <MarketingShell hideAuthLinks>
      <div className="min-h-[70vh] px-5 py-10 sm:py-14">
        <GetStartedPlansPanel />
      </div>
    </MarketingShell>
  )
}
