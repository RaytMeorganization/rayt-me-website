import type { SVGProps } from 'react'

export type IllustrationKind =
  | 'overview'
  | 'queue'
  | 'disputes'
  | 'roster'
  | 'reputation'
  | 'plans'
  | 'audit'
  | 'locked'

const INK = '#17352c'
const LEAF = '#2f7a5c'
const STONE = '#dce7df'

function Frame({ children, ...props }: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 160 120" role="presentation" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}

/** Quiet-luxury line illustrations: stone fills, ink strokes, one leaf accent. */
function Art({ kind }: { kind: IllustrationKind }) {
  switch (kind) {
    case 'queue':
      return (
        <Frame>
          <rect x="34" y="20" width="80" height="82" rx="10" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <rect x="48" y="12" width="52" height="18" rx="9" fill={STONE} stroke={INK} strokeWidth="2.5" />
          {[42, 60, 78].map((y, index) => (
            <g key={y}>
              <circle cx="50" cy={y} r="6" fill={index === 0 ? LEAF : '#fff'} stroke={INK} strokeWidth="2.5" />
              {index === 0 && <path d="M47 42l2.5 2.5 4-4.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />}
              <rect x="64" y={y - 4} width={index === 2 ? 22 : 36} height="7" rx="3.5" fill={STONE} />
            </g>
          ))}
        </Frame>
      )
    case 'disputes':
      return (
        <Frame>
          <path d="M30 26h64a8 8 0 018 8v34a8 8 0 01-8 8H58L38 92V76h-8a8 8 0 01-8-8V34a8 8 0 018-8z" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M62 40v18" stroke={LEAF} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="62" cy="66" r="2.6" fill={LEAF} />
          <path d="M108 44l22 12-22 12z" fill={STONE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </Frame>
      )
    case 'roster':
      return (
        <Frame>
          <circle cx="52" cy="44" r="13" fill={STONE} stroke={INK} strokeWidth="2.5" />
          <path d="M30 92c0-13 10-22 22-22s22 9 22 22" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="104" cy="52" r="10" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M86 92c0-11 8-18 18-18s18 7 18 18" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="118" cy="30" r="9" fill={LEAF} />
          <path d="M114 30l3 3 5-5.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </Frame>
      )
    case 'reputation':
      return (
        <Frame>
          <path d="M80 14l26 10v26c0 22-12 36-26 42-14-6-26-20-26-42V24z" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M68 52l9 9 18-19" fill="none" stroke={LEAF} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 100h112" stroke={STONE} strokeWidth="5" strokeLinecap="round" />
        </Frame>
      )
    case 'plans':
      return (
        <Frame>
          {[
            { x: 30, h: 30 },
            { x: 66, h: 48 },
            { x: 102, h: 66 },
          ].map(({ x, h }, index) => (
            <rect
              key={x}
              x={x}
              y={92 - h}
              width="28"
              height={h}
              rx="6"
              fill={index === 2 ? LEAF : STONE}
              stroke={INK}
              strokeWidth="2.5"
            />
          ))}
          <path d="M22 100h116" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </Frame>
      )
    case 'audit':
      return (
        <Frame>
          <rect x="38" y="16" width="76" height="88" rx="9" fill="#fff" stroke={INK} strokeWidth="2.5" />
          {[36, 54, 72, 88].map((y, index) => (
            <rect key={y} x="52" y={y} width={index % 2 ? 32 : 48} height="6" rx="3" fill={STONE} />
          ))}
          <circle cx="112" cy="88" r="16" fill="#fff" stroke={LEAF} strokeWidth="3" />
          <path d="M105 88l5 5 10-11" fill="none" stroke={LEAF} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </Frame>
      )
    case 'locked':
      return (
        <Frame>
          <rect x="46" y="52" width="68" height="52" rx="11" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <path d="M62 52V40a18 18 0 0136 0v12" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="80" cy="74" r="7" fill={LEAF} />
          <path d="M80 81v9" stroke={LEAF} strokeWidth="3.5" strokeLinecap="round" />
        </Frame>
      )
    default:
      return (
        <Frame>
          <rect x="24" y="30" width="52" height="34" rx="8" fill={STONE} stroke={INK} strokeWidth="2.5" />
          <rect x="84" y="30" width="52" height="34" rx="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <rect x="24" y="72" width="112" height="30" rx="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <circle cx="50" cy="47" r="8" fill={LEAF} />
          <path d="M46 47l3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </Frame>
      )
  }
}

export function Illustration({ kind, className = '' }: { kind: IllustrationKind; className?: string }) {
  return (
    <span className={`pointer-events-none block ${className}`}>
      <Art kind={kind} />
    </span>
  )
}

/** Soft brand backdrop so authenticated surfaces never read as a blank page. */
export function Backdrop() {
  return <div aria-hidden="true" className="rate-backdrop" />
}

export function EmptyState({
  kind,
  title,
  description,
  action,
}: {
  kind: IllustrationKind
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <Illustration kind={kind} className="w-40 max-w-full" />
      <h3 className="text-lg font-semibold tracking-tight text-[#17352c]">{title}</h3>
      <p className="max-w-sm text-sm leading-6 text-[#5c6b64]">{description}</p>
      {action}
    </div>
  )
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[#dbe2dc] bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#5c6b64]">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-.05em] text-[#17352c]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#7a8780]">{hint}</p>}
    </div>
  )
}
