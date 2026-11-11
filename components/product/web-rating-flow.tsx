'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Gauge,
  Handshake,
  Layers2,
  Mail,
  MessageCircle,
  Shield,
  User as UserIcon,
  Users,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { MarketingShell } from '@/components/product/marketing-shell'
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from '@/components/product/turnstile-widget'
import { useAuth, useI18n } from '@/components/product/providers'
import { api, ApiError, errorMessage } from '@/lib/api'
import { INDUSTRY_OPTIONS } from '@/lib/industries'
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/store-links'
import type { PublicProfile, User } from '@/lib/types'
import {
  RELATIONSHIP_LABELS_AR,
  RELATIONSHIP_LABELS_EN,
  RATING_CATEGORIES,
  RATING_COMMENT_MAX,
  WEB_RATING_RELATIONSHIPS,
  WEB_RATING_TURNSTILE_ACTIONS,
  averageCategoryScores,
  clipRatingComment,
  emptyCategoryScores,
  scoresFromOverall,
  snapRatingScore,
  type CategoryScores,
  type RatingCategory,
  type WebRatingRelationship,
} from '@/lib/web-rating'
import { cn } from '@/lib/utils'

type Step = 'verify' | 'code' | 'about' | 'rate' | 'done'

type RatingMode = 'overall' | 'categories'
type Visibility = 'anonymous' | 'title'

const CATEGORY_META: Record<
  RatingCategory,
  { labelKey: 'webRateCatProfessionalism' | 'webRateCatCommunication' | 'webRateCatReliability' | 'webRateCatKnowledge' | 'webRateCatCollaboration'; icon: typeof Briefcase }
> = {
  professionalism: { labelKey: 'webRateCatProfessionalism', icon: Briefcase },
  communication: { labelKey: 'webRateCatCommunication', icon: MessageCircle },
  reliability: { labelKey: 'webRateCatReliability', icon: Shield },
  knowledge: { labelKey: 'webRateCatKnowledge', icon: Layers2 },
  collaboration: { labelKey: 'webRateCatCollaboration', icon: Users },
}

const fieldClass =
  'min-h-12 w-full rounded-xl border border-white/12 bg-[#0a0f14] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-emerald-400/70 focus:ring-2 focus:ring-emerald-400/20'
const iconFieldClass = cn(fieldClass, 'ps-10')
const labelClass = 'mb-1.5 block text-sm font-medium text-white/70'
const requiredMark = <span className="text-emerald-400" aria-hidden>*</span>

export function WebRatingFlow({ profile }: { profile: PublicProfile }) {
  const { t, locale } = useI18n()
  const { user, refresh } = useAuth()
  const [step, setStep] = useState<Step>('verify')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [devCode, setDevCode] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const otpTurnstileRef = useRef<TurnstileWidgetHandle>(null)
  const submitTurnstileRef = useRef<TurnstileWidgetHandle>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState<string>(INDUSTRY_OPTIONS[0].en)
  const [relationship, setRelationship] = useState<WebRatingRelationship>('client')
  const [mode, setMode] = useState<RatingMode>('overall')
  const [overall, setOverall] = useState(4)
  const [scores, setScores] = useState<CategoryScores>(emptyCategoryScores(4))
  const [comment, setComment] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('anonymous')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const relationshipLabels = locale === 'ar' ? RELATIONSHIP_LABELS_AR : RELATIONSHIP_LABELS_EN
  const preview = useMemo(
    () => (mode === 'overall' ? overall : averageCategoryScores(scores)),
    [mode, overall, scores],
  )

  const isOwner = Boolean(user?.id && user.id === profile.id)

  useEffect(() => {
    if (!user || isOwner) return
    const timer = window.setTimeout(() => {
      if (user.name && user.name !== 'Web rater') {
        const parts = user.name.trim().split(/\s+/)
        setFirstName(parts[0] ?? '')
        setLastName(parts.slice(1).join(' '))
      }
      if (user.jobTitle) setJobTitle(user.jobTitle)
      if (user.company) setCompany(user.company)
      if (user.industry) setIndustry(user.industry)
      if (user.email) setEmail(user.email)
      if (user.personalEmailStatus === 'verified' || user.isVerified) {
        setStep((current) =>
          current === 'verify' || current === 'code' ? 'about' : current,
        )
      }
    }, 0)
    return () => window.clearTimeout(timer)
  }, [user, isOwner])

  async function ensureTurnstileToken(ref: RefObject<TurnstileWidgetHandle | null>) {
    const existing = turnstileToken?.trim()
    if (existing) return existing
    const token = await ref.current?.execute()
    if (!token?.trim()) throw new Error(t('webRateBotRequired'))
    setTurnstileToken(token)
    return token
  }

  async function startOtp() {
    setBusy(true)
    setError(null)
    try {
      const token = await ensureTurnstileToken(otpTurnstileRef)
      const result = await api<{ sent: true; message: string; devCode?: string }>(
        '/web-ratings/otp/start',
        {
          method: 'POST',
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            profileId: profile.id,
            turnstileToken: token,
          }),
        },
      )
      setDevCode(result.devCode ?? null)
      setTurnstileToken(null)
      otpTurnstileRef.current?.reset()
      setStep('code')
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError(t('webRateTooMany'))
      } else {
        setError(errorMessage(err, t('error')))
        setTurnstileToken(null)
        otpTurnstileRef.current?.reset()
      }
    } finally {
      setBusy(false)
    }
  }

  async function verifyOtp() {
    setBusy(true)
    setError(null)
    try {
      await api<{ verified: true; user: User }>('/web-ratings/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() }),
      })
      await refresh()
      setStep('about')
    } catch (err) {
      setError(errorMessage(err, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function saveAboutAndContinue() {
    setBusy(true)
    setError(null)
    try {
      await api('/web-ratings/about-you', {
        method: 'POST',
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          jobTitle: jobTitle.trim(),
          company: company.trim() || undefined,
          industry,
          relationship,
        }),
      })
      setStep('rate')
      void refresh()
    } catch (err) {
      setError(errorMessage(err, t('error')))
    } finally {
      setBusy(false)
    }
  }

  async function submitRating() {
    setBusy(true)
    setError(null)
    try {
      if (!acceptedTerms) throw new Error(t('webRateTermsRequired'))
      const token = await ensureTurnstileToken(submitTurnstileRef)
      const categoryScores =
        mode === 'overall'
          ? scoresFromOverall(overall)
          : {
              professionalism: snapRatingScore(scores.professionalism),
              communication: snapRatingScore(scores.communication),
              reliability: snapRatingScore(scores.reliability),
              knowledge: snapRatingScore(scores.knowledge),
              collaboration: snapRatingScore(scores.collaboration),
            }
      await api('/web/ratings', {
        method: 'POST',
        body: JSON.stringify({
          targetUserId: profile.id,
          relationship,
          categoryScores,
          attributionPrivate: visibility === 'anonymous',
          comment: clipRatingComment(comment),
          turnstileToken: token,
          acceptedTerms: true as const,
          marketingOptIn,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          jobTitle: jobTitle.trim(),
          company: company.trim() || undefined,
          industry,
        }),
      })
      setStep('done')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) setError(t('webRateSubmitTooMany'))
        else if (err.status === 503 || /disabled|unavailable/i.test(err.message)) {
          setError(t('webRateEngineOff'))
        } else if (/90 days/i.test(err.message)) setError(t('webRateDuplicate'))
        else if (/allowance exhausted/i.test(err.message)) setError(t('webRateCap'))
        else if (/yourself/i.test(err.message)) setError(t('webRateSelf'))
        else if (/not found|not available/i.test(err.message)) setError(t('webRateUnavailable'))
        else if (/tomorrow/i.test(err.message)) setError(t('webRateBurst'))
        else setError(err.message)
      } else {
        setError(errorMessage(err, t('error')))
      }
      if (!(err instanceof ApiError && err.status === 429)) {
        setTurnstileToken(null)
        submitTurnstileRef.current?.reset()
      }
    } finally {
      setBusy(false)
    }
  }

  const title = t('webRateTitle').replace('{name}', profile.name)

  return (
    <MarketingShell>
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-5 sm:py-12">
        <section
          className={cn(
            'rounded-[1.35rem] border border-white/10 bg-[#101820]/92 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-7',
          )}
        >
          <header className="mb-6 text-center">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-emerald-400">
              RaytME
            </p>
            <h1 className="mt-2 font-serif text-[1.85rem] font-semibold tracking-tight text-white sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{t('webRateSubtitle')}</p>
          </header>

          <div className="space-y-5">
            {isOwner ? (
              <p className="rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-sm text-red-100" role="alert">
                {t('webRateSelf')}
              </p>
            ) : null}
            {error ? (
              <p
                className="rounded-xl border border-red-400/35 bg-red-500/15 px-3 py-2 text-sm font-medium text-red-50"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            {!isOwner && step === 'verify' ? (
              <>
                <IconField id="web-rate-email" label={t('email')} required icon={<Mail className="size-4" />}>
                  <input
                    id="web-rate-email"
                    type="email"
                    required
                    autoComplete="email"
                    className={iconFieldClass}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </IconField>
                <TurnstileWidget
                  ref={otpTurnstileRef}
                  action={WEB_RATING_TURNSTILE_ACTIONS.otp}
                  onToken={setTurnstileToken}
                />
                <PrimaryButton
                  disabled={busy || !email.trim()}
                  onClick={() => void startOtp()}
                >
                  {busy ? t('saving') : t('webRateSendCode')}
                </PrimaryButton>
              </>
            ) : null}

            {!isOwner && step === 'code' ? (
              <>
                <p className="text-sm text-white/55">{t('webRateCodeHelp')}</p>
                {devCode ? (
                  <p className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                    {t('developmentCode')}: {devCode}
                  </p>
                ) : null}
                <div>
                  <label htmlFor="web-rate-code" className={labelClass}>
                    {t('code')} {requiredMark}
                  </label>
                  <input
                    id="web-rate-code"
                    inputMode="numeric"
                    maxLength={6}
                    className={cn(fieldClass, 'tracking-[0.35em]')}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>
                <PrimaryButton
                  disabled={busy || code.length !== 6}
                  onClick={() => void verifyOtp()}
                >
                  {busy ? t('saving') : t('confirmCode')}
                </PrimaryButton>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    className="min-h-11 text-sm font-semibold text-emerald-300 underline-offset-4 hover:underline disabled:opacity-50"
                    disabled={busy}
                    onClick={() => void startOtp()}
                  >
                    {t('webRateResendCode')}
                  </button>
                  <button
                    type="button"
                    className="min-h-11 text-sm font-semibold text-white/55 underline-offset-4 hover:text-white hover:underline disabled:opacity-50"
                    disabled={busy}
                    onClick={() => {
                      setCode('')
                      setDevCode(null)
                      setError(null)
                      setTurnstileToken(null)
                      otpTurnstileRef.current?.reset()
                      setStep('verify')
                    }}
                  >
                    {t('webRateChangeEmail')}
                  </button>
                </div>
              </>
            ) : null}

            {!isOwner && step === 'about' ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconField id="web-first" label={t('webRateFirstName')} required icon={<UserIcon className="size-4" />}>
                    <input
                      id="web-first"
                      className={iconFieldClass}
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </IconField>
                  <IconField id="web-last" label={t('webRateLastName')} required icon={<UserIcon className="size-4" />}>
                    <input
                      id="web-last"
                      className={iconFieldClass}
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </IconField>
                </div>
                <IconField id="web-title" label={t('jobTitle')} required icon={<Briefcase className="size-4" />}>
                  <input
                    id="web-title"
                    className={iconFieldClass}
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </IconField>
                <IconField id="web-company" label={t('company')} icon={<Building2 className="size-4" />}>
                  <input
                    id="web-company"
                    className={iconFieldClass}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </IconField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconField id="web-industry" label={t('industry')} required icon={<Layers2 className="size-4" />}>
                    <select
                      id="web-industry"
                      className={cn(iconFieldClass, 'appearance-none pe-8')}
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      {INDUSTRY_OPTIONS.map((option) => (
                        <option key={option.key} value={option.en} className="bg-[#0a0f14] text-white">
                          {locale === 'ar' ? option.ar : option.en}
                        </option>
                      ))}
                    </select>
                  </IconField>
                  <IconField
                    id="web-relationship"
                    label={t('webRateHowKnow').replace('{name}', profile.name)}
                    required
                    icon={<Handshake className="size-4" />}
                  >
                    <select
                      id="web-relationship"
                      className={cn(iconFieldClass, 'appearance-none pe-8')}
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value as WebRatingRelationship)}
                    >
                      {WEB_RATING_RELATIONSHIPS.map((value) => (
                        <option key={value} value={value} className="bg-[#0a0f14] text-white">
                          {relationshipLabels[value]}
                        </option>
                      ))}
                    </select>
                  </IconField>
                </div>
                <PrimaryButton
                  disabled={busy || !firstName.trim() || !lastName.trim() || !jobTitle.trim()}
                  onClick={() => void saveAboutAndContinue()}
                >
                  {busy ? t('saving') : (
                    <span className="inline-flex items-center gap-2">
                      {t('continue')}
                      <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                    </span>
                  )}
                </PrimaryButton>
              </>
            ) : null}

            {!isOwner && step === 'rate' ? (
              <>
                <div className="inline-flex rounded-full border border-white/12 bg-[#0a0f14] p-1">
                  <ModeChip
                    active={mode === 'overall'}
                    onClick={() => {
                      setOverall(averageCategoryScores(scores))
                      setMode('overall')
                    }}
                  >
                    {t('webRateModeOverall')}
                  </ModeChip>
                  <ModeChip
                    active={mode === 'categories'}
                    onClick={() => {
                      setScores(scoresFromOverall(overall))
                      setMode('categories')
                    }}
                  >
                    {t('webRateModeCategories')}
                  </ModeChip>
                </div>

                <div className="space-y-4">
                  {mode === 'overall' ? (
                    <ScoreSlider
                      icon={<Gauge className="size-4" />}
                      label={t('webRateOverall')}
                      value={overall}
                      onChange={setOverall}
                    />
                  ) : (
                    RATING_CATEGORIES.map((key) => {
                      const meta = CATEGORY_META[key]
                      const Icon = meta.icon
                      return (
                        <ScoreSlider
                          key={key}
                          icon={<Icon className="size-4" />}
                          label={t(meta.labelKey)}
                          value={scores[key]}
                          onChange={(next) =>
                            setScores((current) => ({ ...current, [key]: next }))
                          }
                        />
                      )
                    })
                  )}
                </div>

                <p className="text-sm text-white/55">
                  {t('webRatePreview')}:{' '}
                  <strong className="font-semibold text-white">{preview.toFixed(1)}</strong>
                </p>

                <div>
                  <label htmlFor="web-comment" className={labelClass}>
                    {t('webRateComment')}
                  </label>
                  <textarea
                    id="web-comment"
                    maxLength={RATING_COMMENT_MAX}
                    rows={3}
                    className={cn(fieldClass, 'min-h-24 resize-y')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="grid gap-3">
                  <VisibilityOption
                    checked={visibility === 'anonymous'}
                    onChange={() => setVisibility('anonymous')}
                    title={t('webRateAnonymous')}
                    help={t('webRateAnonymousHelp')}
                  />
                  <VisibilityOption
                    checked={visibility === 'title'}
                    onChange={() => setVisibility('title')}
                    title={t('webRateShowTitle')}
                    help={t('webRateShowTitleHelp')}
                  />
                </div>

                <label className="flex items-start gap-2.5 text-sm text-white/80">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border-white/30 bg-transparent accent-emerald-400"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>
                    {t('webRateTermsPrefix')}{' '}
                    <Link className="underline decoration-white/40 underline-offset-2 hover:text-white" href="/terms">
                      {t('webRateTerms')}
                    </Link>{' '}
                    {t('webRateAnd')}{' '}
                    <Link className="underline decoration-white/40 underline-offset-2 hover:text-white" href="/privacy">
                      {t('webRatePrivacy')}
                    </Link>
                    {'. '}
                    {t('webRateTermsSuffix')}
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-sm text-white/55">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border-white/30 bg-transparent accent-emerald-400"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                  />
                  <span>{t('webRateMarketing')}</span>
                </label>

                <TurnstileWidget
                  ref={submitTurnstileRef}
                  action={WEB_RATING_TURNSTILE_ACTIONS.submit}
                  onToken={setTurnstileToken}
                />

                <PrimaryButton
                  disabled={busy || !acceptedTerms}
                  onClick={() => void submitRating()}
                >
                  {busy ? t('saving') : t('webRateSubmit')}
                </PrimaryButton>
              </>
            ) : null}

            {!isOwner && step === 'done' ? (
              <div className="space-y-4 text-center">
                <p className="font-serif text-2xl font-semibold text-white">{t('webRateDoneTitle')}</p>
                <p className="text-sm text-white/55">{t('webRateDoneBody')}</p>
                <p className="pt-2 font-semibold text-white">{t('webRateCreateCard')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a className={buttonVariants({ className: 'rounded-full bg-white text-black hover:bg-white/90' })} href={APP_STORE_URL}>
                    App Store
                  </a>
                  <a
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'rounded-full border-white/20 bg-transparent text-white hover:bg-white/10',
                    })}
                    href={PLAY_STORE_URL}
                  >
                    Google Play
                  </a>
                </div>
                <Link
                  className={buttonVariants({
                    variant: 'ghost',
                    className: 'rounded-full text-white/70 hover:bg-white/10 hover:text-white',
                  })}
                  href={`/p/${encodeURIComponent(profile.id)}`}
                >
                  {t('webRateBackToCard')}
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </MarketingShell>
  )
}

function IconField({
  id,
  label,
  required,
  icon,
  children,
}: {
  id: string
  label: string
  required?: boolean
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required ? requiredMark : null}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-emerald-400">
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

function PrimaryButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="min-h-12 w-full rounded-full bg-white text-base font-semibold text-black hover:bg-white/90 disabled:bg-white/35 disabled:text-black/50"
    >
      {children}
    </Button>
  )
}

function ModeChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-10 rounded-full px-4 text-sm font-semibold transition',
        active
          ? 'bg-white text-black shadow-sm'
          : 'bg-transparent text-emerald-300/90 hover:text-emerald-200',
      )}
    >
      {children}
    </button>
  )
}

function VisibilityOption({
  checked,
  onChange,
  title,
  help,
}: {
  checked: boolean
  onChange: () => void
  title: string
  help: string
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#0a0f14]/80 px-3 py-3">
      <input
        type="radio"
        name="visibility"
        className="mt-1 size-4 accent-emerald-400"
        checked={checked}
        onChange={onChange}
      />
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-white/50">{help}</span>
      </span>
    </label>
  )
}

function ScoreSlider({
  icon,
  label,
  value,
  onChange,
}: {
  icon: ReactNode
  label: string
  value: number
  onChange: (value: number) => void
}) {
  const pct = ((value - 1) / 4) * 100
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="inline-flex items-center gap-2 font-medium text-white/80">
          <span className="text-emerald-400">{icon}</span>
          {label}
        </span>
        <span className="font-mono tabular-nums text-white">{value.toFixed(1)}</span>
      </div>
      <div className="relative h-2.5 rounded-full bg-white/15">
        <div
          className="absolute inset-y-0 start-0 rounded-full bg-emerald-400"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={1}
          max={5}
          step={0.5}
          value={value}
          onChange={(e) => onChange(snapRatingScore(Number(e.target.value)))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-emerald-400 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-emerald-400 [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-emerald-400"
          aria-label={label}
        />
      </div>
    </label>
  )
}
