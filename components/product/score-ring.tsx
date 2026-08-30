const GOLD = '#AD8547'
const GOLD_TINT = '#F4E9D3'
const NAVY = '#11213D'
const SAGE = '#2E6B4C'

export function ScoreRing({
  score,
  verified = true,
  size = 62,
  className = '',
}: {
  score: number
  verified?: boolean
  size?: number
  className?: string
}) {
  const clamped = Math.max(0, Math.min(5, Number(score) || 0))
  const stroke = Math.max(3.5, size * 0.065)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const filled = circumference * (clamped / 5)
  const label = `${clamped.toFixed(1)} out of 5${verified ? ', verified reputation' : ''}`

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={GOLD_TINT}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={GOLD}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={NAVY}
          fontFamily="Georgia, 'Iowan Old Style', Palatino, serif"
          fontSize={size * 0.28}
          aria-hidden="true"
        >
          {clamped.toFixed(1)}
        </text>
      </svg>
      {verified ? (
        <p className="mt-1 text-[10px] font-semibold tracking-[.04em] text-[#2E6B4C]" style={{ color: SAGE }}>
          Verified
        </p>
      ) : null}
    </div>
  )
}
