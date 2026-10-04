'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MarketingShell } from '@/components/product/marketing-shell'
import { GetStartedAccountForm } from '@/components/product/get-started-account-form'
import { capturePlanFromSearchParams } from '@/lib/get-started-funnel'

function GetStartedCapture() {
  const params = useSearchParams()
  useEffect(() => {
    capturePlanFromSearchParams(params)
  }, [params])
  return null
}

export default function GetStartedPage() {
  return (
    <MarketingShell hideAuthLinks>
      <Suspense fallback={null}>
        <GetStartedCapture />
      </Suspense>
      <div className="mx-auto max-w-lg px-5 py-10 sm:py-14">
        <GetStartedAccountForm />
      </div>
    </MarketingShell>
  )
}
