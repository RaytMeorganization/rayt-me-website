import Image from 'next/image'

import { cn } from '@/lib/utils'

type LogoLockupProps = {
  className?: string
  /** Light text for dark backgrounds (footer, landing nav). Dark text for light backgrounds. */
  tone?: 'dark' | 'light'
  /** Show RATE. TRUST. GROW. under the wordmark — footer / hero contexts. */
  showTagline?: boolean
  /** Compact mark size for nav bars. */
  size?: 'sm' | 'md'
  /** Use the full horizontal lockup PNG (R + RaytME + tagline) as-is. */
  variant?: 'composed' | 'full'
}

/** Official RaytME lockup: R mark + RaytME + optional tagline. */
export function LogoLockup({
  className,
  tone = 'dark',
  showTagline = false,
  size = 'md',
  variant = 'composed',
}: LogoLockupProps) {
  if (variant === 'full') {
    const width = size === 'sm' ? 200 : 240
    const height = Math.round(width * (156 / 480))

    return (
      <span className={cn('inline-flex items-center', className)}>
        <Image
          src="/logo-raytme.png"
          alt="RaytME"
          width={width}
          height={height}
          className="h-auto w-auto max-w-full"
          priority
        />
      </span>
    )
  }

  const markSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9 sm:h-10 sm:w-10'
  const wordSize = size === 'sm' ? 'text-lg' : 'text-xl sm:text-[1.35rem]'

  return (
    <span className={cn('inline-flex items-center gap-2.5 sm:gap-3', className)}>
      <Image
        src="/logo-mark.png"
        alt=""
        width={44}
        height={44}
        className={cn('shrink-0 rounded-2xl', markSize)}
        priority
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            'font-brand font-semibold tracking-tight',
            wordSize,
            tone === 'light' ? 'text-white' : 'text-foreground',
          )}
        >
          RaytME
        </span>
        {showTagline ? (
          <span
            className={cn(
              'mt-1 font-brand text-[0.62rem] font-medium uppercase tracking-[0.22em] sm:text-[0.65rem]',
              tone === 'light' ? 'text-white/55' : 'text-muted-foreground',
            )}
          >
            RATE. TRUST. GROW.
          </span>
        ) : null}
      </span>
    </span>
  )
}
