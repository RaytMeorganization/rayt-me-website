'use client'

import { Suspense, useEffect, useState } from 'react'
import { TeamRatingsFeed } from '@/components/product/team-ratings-feed'
import { LoadingBlock } from '@/components/product/dashboard-ui'
import { ProductShell } from '@/components/product/shell'
import { api } from '@/lib/api'

function RatingsRoute() {
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void api<Record<string, unknown>[]>('/business/members')
        .then((rows) => {
          setEmployees(
            rows.flatMap((row) => {
              const user = row.user as { id?: string; name?: string } | undefined
              if (!user?.id) return []
              return [{ id: String(user.id), name: String(user.name || user.id) }]
            }),
          )
        })
        .catch(() => setEmployees([]))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  return <TeamRatingsFeed employees={employees} />
}

export default function TeamRatingsPage() {
  return (
    <Suspense
      fallback={
        <ProductShell role="business">
          <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
            <LoadingBlock rows={4} />
          </main>
        </ProductShell>
      }
    >
      <RatingsRoute />
    </Suspense>
  )
}
