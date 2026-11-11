'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
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
  type WebRatingRelationship,
} from '@/lib/web-rating'
import { cn } from '@/lib/utils'

type Step = 'verify' | 'code' | 'about' | 'rate' | 'done'

type RatingMode = 'overall' | 'categories'
type Visibility = 'anonymous' | 'title'

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
      // Prefill about-you for returning guests / signed-in users.
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
        setStep('about')
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
      setError(errorMessage(err, t('error')))
      setTurnstileToken(null)
      otpTurnstileRef.current?.reset()
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
      await refresh()
      setStep('rate')
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
        if (/90 days/i.test(err.message)) setError(t('webRateDuplicate'))
        else if (/allowance exhausted/i.test(err.message)) setError(t('webRateCap'))
        else if (/yourself/i.test(err.message)) setError(t('webRateSelf'))
        else if (/not found|not available/i.test(err.message)) setError(t('webRateUnavailable'))
        else if (/tomorrow/i.test(err.message)) setError(t('webRateBurst'))
        else setError(err.message)
      } else {
        setError(errorMessage(err, t('error')))
      }
      setTurnstileToken(null)
      submitTurnstileRef.current?.reset()
    } finally {
      setBusy(false)
    }
  }

  const title = t('webRateTitle').replace('{name}', profile.name)

  return (
    <MarketingShell>
      <div className="mx-auto max-w-xl px-5 py-10 sm:py-14">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
          RaytME
        </p>
        <h1 className="text-center font-serif text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">{t('webRateSubtitle')}</p>

        <Card className="mt-8 border-[#d9dfd9] bg-white/90 shadow-none">
          <CardContent className="space-y-5 p-6">
            {isOwner ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {t('webRateSelf')}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {error}
              </p>
            ) : null}

            {!isOwner && step === 'verify' ? (
              <>
                <Field>
                  <FieldLabel htmlFor="web-rate-email">
                    {t('email')} <span aria-hidden>*</span>
                  </FieldLabel>
                  <Input
                    id="web-rate-email"
                    type="email"
                    required
                    autoComplete="email"
                    className="min-h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <TurnstileWidget
                  ref={otpTurnstileRef}
                  action={WEB_RATING_TURNSTILE_ACTIONS.otp}
                  onToken={setTurnstileToken}
                />
                <Button
                  className="min-h-11 w-full rounded-full"
                  disabled={busy || !email.trim()}
                  onClick={() => void startOtp()}
                >
                  {busy ? t('saving') : t('webRateSendCode')}
                </Button>
              </>
            ) : null}

            {!isOwner && step === 'code' ? (
              <>
                <p className="text-sm text-muted-foreground">{t('webRateCodeHelp')}</p>
                {devCode ? (
                  <p className="rounded-xl bg-[#edf3ed] px-3 py-2 text-sm text-foreground">
                    {t('developmentCode')}: {devCode}
                  </p>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="web-rate-code">
                    {t('code')} <span aria-hidden>*</span>
                  </FieldLabel>
                  <Input
                    id="web-rate-code"
                    inputMode="numeric"
                    maxLength={6}
                    className="min-h-11 tracking-[0.3em]"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </Field>
                <Button
                  className="min-h-11 w-full rounded-full"
                  disabled={busy || code.length !== 6}
                  onClick={() => void verifyOtp()}
                >
                  {busy ? t('saving') : t('confirmCode')}
                </Button>
              </>
            ) : null}

            {!isOwner && step === 'about' ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="web-first">
                      {t('webRateFirstName')} <span aria-hidden>*</span>
                    </FieldLabel>
                    <Input id="web-first" className="min-h-11" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="web-last">
                      {t('webRateLastName')} <span aria-hidden>*</span>
                    </FieldLabel>
                    <Input id="web-last" className="min-h-11" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="web-title">
                    {t('jobTitle')} <span aria-hidden>*</span>
                  </FieldLabel>
                  <Input id="web-title" className="min-h-11" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="web-company">{t('company')}</FieldLabel>
                  <Input id="web-company" className="min-h-11" value={company} onChange={(e) => setCompany(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="web-industry">
                    {t('industry')} <span aria-hidden>*</span>
                  </FieldLabel>
                  <select
                    id="web-industry"
                    className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    {INDUSTRY_OPTIONS.map((option) => (
                      <option key={option.key} value={option.en}>
                        {locale === 'ar' ? option.ar : option.en}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="web-relationship">
                    {t('webRateHowKnow').replace('{name}', profile.name)} <span aria-hidden>*</span>
                  </FieldLabel>
                  <select
                    id="web-relationship"
                    className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as WebRatingRelationship)}
                  >
                    {WEB_RATING_RELATIONSHIPS.map((value) => (
                      <option key={value} value={value}>
                        {relationshipLabels[value]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Button
                  className="min-h-11 w-full rounded-full"
                  disabled={busy || !firstName.trim() || !lastName.trim() || !jobTitle.trim()}
                  onClick={() => void saveAboutAndContinue()}
                >
                  {busy ? t('saving') : t('continue')}
                </Button>
              </>
            ) : null}

            {!isOwner && step === 'rate' ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={cn(
                      'min-h-11 rounded-full px-4 text-sm font-semibold',
                      mode === 'overall' ? 'bg-[#17201e] text-white' : 'border border-[#d9dfd9] bg-white',
                    )}
                    onClick={() => {
                      setOverall(averageCategoryScores(scores))
                      setMode('overall')
                    }}
                  >
                    {t('webRateModeOverall')}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'min-h-11 rounded-full px-4 text-sm font-semibold',
                      mode === 'categories' ? 'bg-[#17201e] text-white' : 'border border-[#d9dfd9] bg-white',
                    )}
                    onClick={() => {
                      setScores(scoresFromOverall(overall))
                      setMode('categories')
                    }}
                  >
                    {t('webRateModeCategories')}
                  </button>
                </div>

                {mode === 'overall' ? (
                  <ScoreSlider
                    label={t('webRateOverall')}
                    value={overall}
                    onChange={setOverall}
                  />
                ) : (
                  RATING_CATEGORIES.map((key) => (
                    <ScoreSlider
                      key={key}
                      label={t(
                        key === 'professionalism'
                          ? 'webRateCatProfessionalism'
                          : key === 'communication'
                            ? 'webRateCatCommunication'
                            : key === 'reliability'
                              ? 'webRateCatReliability'
                              : key === 'knowledge'
                                ? 'webRateCatKnowledge'
                                : 'webRateCatCollaboration',
                      )}
                      value={scores[key]}
                      onChange={(value) => setScores((current) => ({ ...current, [key]: value }))}
                    />
                  ))
                )}

                <p className="text-sm text-muted-foreground">
                  {t('webRatePreview')}: <strong className="text-foreground">{preview.toFixed(1)}</strong>
                </p>

                <Field>
                  <FieldLabel htmlFor="web-comment">{t('webRateComment')}</FieldLabel>
                  <textarea
                    id="web-comment"
                    maxLength={RATING_COMMENT_MAX}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </Field>

                <div className="grid gap-2">
                  <label className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === 'anonymous'}
                      onChange={() => setVisibility('anonymous')}
                    />
                    {t('webRateAnonymous')}
                  </label>
                  <label className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="visibility"
                      checked={visibility === 'title'}
                      onChange={() => setVisibility('title')}
                    />
                    {t('webRateShowTitle')}
                  </label>
                </div>

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>
                    {t('webRateTermsPrefix')}{' '}
                    <Link className="underline" href="/terms">{t('webRateTerms')}</Link>
                    {' '}{t('webRateAnd')}{' '}
                    <Link className="underline" href="/privacy">{t('webRatePrivacy')}</Link>
                    {'. '}
                    {t('webRateTermsSuffix')}
                  </span>
                </label>
                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="mt-1"
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

                <Button
                  className="min-h-11 w-full rounded-full"
                  disabled={busy || !acceptedTerms}
                  onClick={() => void submitRating()}
                >
                  {busy ? t('saving') : t('webRateSubmit')}
                </Button>
              </>
            ) : null}

            {!isOwner && step === 'done' ? (
              <div className="space-y-4 text-center">
                <p className="font-serif text-2xl font-semibold text-foreground">{t('webRateDoneTitle')}</p>
                <p className="text-sm text-muted-foreground">{t('webRateDoneBody')}</p>
                <p className="pt-2 font-semibold text-foreground">{t('webRateCreateCard')}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a className={buttonVariants()} href={APP_STORE_URL}>App Store</a>
                  <a className={buttonVariants({ variant: 'outline' })} href={PLAY_STORE_URL}>Google Play</a>
                </div>
                <Link className={buttonVariants({ variant: 'ghost' })} href={`/p/${encodeURIComponent(profile.id)}`}>
                  {t('webRateBackToCard')}
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </MarketingShell>
  )
}

function ScoreSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono tabular-nums text-foreground">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={0.5}
        value={value}
        onChange={(e) => onChange(snapRatingScore(Number(e.target.value)))}
        className="w-full accent-emerald-700"
      />
    </label>
  )
}
