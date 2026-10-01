import { notFound } from 'next/navigation'
import { API_URL } from '@/lib/api'

type Card = { publicCode: string; name: string }

export default async function WaitingCardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const response = await fetch(`${API_URL}/waiting-list/${encodeURIComponent(code)}`, { cache: 'no-store' })
  if (response.status === 404) notFound()
  if (!response.ok) notFound()
  const body = (await response.json()) as { data?: Card }
  const card = body.data
  if (!card?.publicCode) notFound()

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-16 text-white">
      <article className="w-full max-w-sm rounded-[28px] border border-white/10 bg-gradient-to-b from-slate-900 to-black p-8 shadow-2xl">
        <p className="text-xs tracking-[0.2em] text-white/50">RAYTME</p>
        <h1 className="mt-6 font-serif text-3xl">{card.name}</h1>
        <p className="mt-2 text-sm text-white/60">Waiting list</p>
        <p className="mt-8 font-mono text-2xl tracking-wide text-amber-200">{card.publicCode}</p>
        <p className="mt-3 text-sm text-white/50">This id is your place in line. The card has no QR code.</p>
      </article>
    </main>
  )
}
