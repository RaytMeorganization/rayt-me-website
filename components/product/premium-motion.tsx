'use client'

import { useEffect, useRef, useState } from 'react'

const easing = (progress: number) => 1 - Math.pow(1 - progress, 4)

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1200,
  className,
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const node = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const element = node.current
    if (!element) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      const reducedFrame = window.requestAnimationFrame(() => setDisplay(value))
      return () => window.cancelAnimationFrame(reducedFrame)
    }

    let frame = 0
    let started = false
    const run = () => {
      if (started) return
      started = true
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        setDisplay(value * easing(progress))
        if (progress < 1) frame = window.requestAnimationFrame(tick)
      }
      frame = window.requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      run()
    }, { threshold: 0.01, rootMargin: '80px 0px' })

    observer.observe(element)
    const rect = element.getBoundingClientRect()
    if (rect.bottom > 0 && rect.top < (window.innerHeight || 0) + 80) run()

    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [duration, value])

  return (
    <span ref={node} className={className} aria-label={`${prefix}${value.toFixed(decimals)}${suffix}`}>
      <span aria-hidden="true">{prefix}{display.toFixed(decimals)}{suffix}</span>
    </span>
  )
}

export function AnimatedValue({ value, className }: { value: string; className?: string }) {
  const match = value.trim().match(/^([^0-9+-]*)([+-]?\d+(?:\.\d+)?)(.*)$/)
  if (!match) return <span className={className}>{value}</span>
  const [, prefix = '', numeric = '0', suffix = ''] = match
  const parsed = Number(numeric)
  if (!Number.isFinite(parsed)) return <span className={className}>{value}</span>
  const decimals = numeric.includes('.') ? numeric.split('.')[1]?.length ?? 0 : 0
  return <AnimatedNumber value={parsed} decimals={decimals} prefix={prefix} suffix={suffix} className={className} />
}

const REVEAL_SELECTOR = '[data-premium-reveal], main > section'

/**
 * Adds restrained scroll reveals and hero depth without a runtime animation
 * dependency. The observer writes state to CSS and respects reduced motion.
 * Re-observes nodes mounted after first paint (Settings tabs, dashboard panels).
 */
export function MotionDirector() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = new WeakSet<Element>()

    const revealNow = (target: HTMLElement) => {
      target.dataset.premiumVisible = 'true'
    }

    const inViewport = (target: HTMLElement) => {
      const rect = target.getBoundingClientRect()
      const vh = window.innerHeight || 0
      return rect.bottom > 0 && rect.top < vh
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const target = entry.target as HTMLElement
        revealNow(target)
        observer.unobserve(target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    const observeTarget = (target: HTMLElement) => {
      if (seen.has(target)) return
      seen.add(target)
      if (reduceMotion) {
        revealNow(target)
        return
      }
      observer.observe(target)
      if (inViewport(target)) revealNow(target)
    }

    const watch = (root: ParentNode = document) => {
      root.querySelectorAll?.<HTMLElement>(REVEAL_SELECTOR).forEach(observeTarget)
    }

    watch()

    const mutations = new MutationObserver(records => {
      for (const record of records) {
        record.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return
          if (node.matches(REVEAL_SELECTOR)) observeTarget(node as HTMLElement)
          watch(node)
        })
      }
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    let frame = 0
    const updateDepth = () => {
      frame = 0
      document.documentElement.style.setProperty('--rate-scroll-depth', `${Math.min(window.scrollY * 0.08, 70)}px`)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateDepth)
    }
    updateDepth()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
