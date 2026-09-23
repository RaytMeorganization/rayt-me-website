import { Suspense } from 'react'

function SettingsFallback() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-muted/40" />
      <div className="mt-4 h-10 w-64 animate-pulse rounded-lg bg-muted/40" />
      <div className="mt-8 grid gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/30" />
        ))}
      </div>
    </main>
  )
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<SettingsFallback />}>{children}</Suspense>
}
