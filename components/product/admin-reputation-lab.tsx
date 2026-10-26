'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { api, errorMessage } from '@/lib/api'
import { useI18n } from '@/components/product/providers'

// Admin-only copy, EN + AR. Numeric weights are shown as-is; the formula text comes from the API.
const LAB_COPY = {
  en: {
    rel_worked_with: 'Colleague — worked with (0.90)',
    rel_client: 'Client (1.00)',
    rel_manager: 'Manager (1.15)',
    rel_employee: 'Employee (0.95)',
    rel_supplier: 'Supplier (0.80)',
    rel_met_professionally: 'Met professionally (0.55)',
    rel_event_networking: 'Met at an event (0.40)',
    preset_alwaysFive: 'Always gives 5',
    preset_lowCredibility: 'Low credibility (mostly 5s)',
    preset_realistic: 'Realistic mix',
    preset_highlyCredible: 'Highly credible raters',
    'profile_lab-profile-one-five': 'Noor — one 5 from an always-5 colleague',
    'profile_lab-profile-super-colleague': 'Hadi — one 5 from a Super Voter colleague',
    'profile_lab-profile-event': 'Lina — one 5 from an always-5 event contact',
    'profile_lab-profile-built': 'Omar — eight mixed colleague ratings',
    simulationFailed: 'Simulation failed',
    checkFailed: 'Profile check failed',
    internalNote: 'Internal calibration only. Runs the live scoring formula and snapshot shape. It does not save ratings or change profile scores.',
    simulationTitle: 'Rating and scoring simulation',
    starsGiven: 'Stars they give (R)',
    timesApplied: 'How many times this pattern is applied',
    relationship: 'Relationship',
    raterHistory: 'Rater history',
    peopleInWindow: 'Different people rated in 90 days (Super Voter)',
    alreadySuperVoter: 'Already a Super Voter',
    yes: 'Yes',
    no: 'No',
    running: 'Running…',
    runSimulation: 'Run simulation',
    checkTitle: 'Live profile accuracy and snapshot',
    checkHelp: 'Replays visible ratings with the same formula and shows the professional snapshot the app would return. Nothing is written. Demo profiles are created by the backend seed.',
    userId: 'User id',
    checking: 'Checking…',
    checkProfile: 'Check profile',
    finalScore: 'Final score',
    startsAt: 'Starts at',
    afterFirst: 'After first rating',
    credibility: 'Credibility',
    weight: 'Weight W',
    superVoter: 'Super Voter',
    active: 'active',
    notActive: 'not active',
    needs: 'Needs {min} different people in 90 days and credibility at least {cred}.',
    hasPeople: 'This rater has {people} people and credibility {cred}.',
    wouldEarn: 'They would earn Super Voter on this rating.',
    wouldSuspend: 'Super Voter would be suspended.',
    headline: 'Headline',
    previousEmployment: 'Previous employment',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    licenses: 'Licenses',
    certifications: 'Certifications',
    memberships: 'Memberships',
    cv: 'CV',
    matches: 'Stored score matches replay',
    mismatch: 'Mismatch Δ',
    storedScore: 'Stored score',
    replayedScore: 'Replayed score',
    visibleRatings: 'Visible ratings',
    snapshot: 'Professional snapshot',
    relWeight: 'Rel. weight',
    noRatings: 'No visible ratings yet. Score should stay at 3.00.',
    scorePath: 'Score path',
  },
  ar: {
    rel_worked_with: 'زميل — عمل معه (0.90)',
    rel_client: 'عميل (1.00)',
    rel_manager: 'مدير (1.15)',
    rel_employee: 'موظف (0.95)',
    rel_supplier: 'مورّد (0.80)',
    rel_met_professionally: 'تعارف مهني (0.55)',
    rel_event_networking: 'تعارف في فعالية (0.40)',
    preset_alwaysFive: 'يعطي 5 دائماً',
    preset_lowCredibility: 'مصداقية منخفضة (غالباً 5)',
    preset_realistic: 'مزيج واقعي',
    preset_highlyCredible: 'مقيّمون ذوو مصداقية عالية',
    'profile_lab-profile-one-five': 'نور — تقييم 5 واحد من زميل يعطي 5 دائماً',
    'profile_lab-profile-super-colleague': 'هادي — تقييم 5 واحد من زميل مُقيّم مميز',
    'profile_lab-profile-event': 'لينا — تقييم 5 واحد من جهة اتصال في فعالية تعطي 5 دائماً',
    'profile_lab-profile-built': 'عمر — ثمانية تقييمات متنوعة من زملاء',
    simulationFailed: 'فشلت المحاكاة',
    checkFailed: 'فشل فحص الملف',
    internalNote: 'للمعايرة الداخلية فقط. تُشغّل معادلة التقييم الحالية وشكل الملخص. لا تحفظ تقييمات ولا تغيّر نتائج الملفات.',
    simulationTitle: 'محاكاة التقييم والنتيجة',
    starsGiven: 'النجوم الممنوحة (R)',
    timesApplied: 'عدد مرات تطبيق هذا النمط',
    relationship: 'العلاقة',
    raterHistory: 'سجل المقيّم',
    peopleInWindow: 'عدد الأشخاص المختلفين المقيَّمين خلال 90 يوماً (مُقيّم مميز)',
    alreadySuperVoter: 'مُقيّم مميز حالياً',
    yes: 'نعم',
    no: 'لا',
    running: 'جارٍ التشغيل…',
    runSimulation: 'تشغيل المحاكاة',
    checkTitle: 'دقة الملف الحالي والملخص',
    checkHelp: 'تعيد احتساب التقييمات الظاهرة بالمعادلة نفسها وتعرض الملخص المهني الذي يعيده التطبيق. لا يُحفظ أي شيء. الملفات التجريبية تُنشأ من بيانات الخادم التجريبية.',
    userId: 'معرّف المستخدم',
    checking: 'جارٍ الفحص…',
    checkProfile: 'فحص الملف',
    finalScore: 'النتيجة النهائية',
    startsAt: 'تبدأ عند',
    afterFirst: 'بعد أول تقييم',
    credibility: 'المصداقية',
    weight: 'الوزن W',
    superVoter: 'مُقيّم مميز',
    active: 'مفعّل',
    notActive: 'غير مفعّل',
    needs: 'يتطلب {min} أشخاص مختلفين خلال 90 يوماً ومصداقية لا تقل عن {cred}.',
    hasPeople: 'لدى هذا المقيّم {people} أشخاص ومصداقية {cred}.',
    wouldEarn: 'سيحصل على صفة مُقيّم مميز بهذا التقييم.',
    wouldSuspend: 'سيتم تعليق صفة مُقيّم مميز.',
    headline: 'العنوان المهني',
    previousEmployment: 'الوظائف السابقة',
    education: 'التعليم',
    skills: 'المهارات',
    languages: 'اللغات',
    licenses: 'التراخيص',
    certifications: 'الشهادات',
    memberships: 'العضويات',
    cv: 'السيرة الذاتية',
    matches: 'النتيجة المحفوظة تطابق إعادة الاحتساب',
    mismatch: 'عدم تطابق Δ',
    storedScore: 'النتيجة المحفوظة',
    replayedScore: 'النتيجة المعاد احتسابها',
    visibleRatings: 'التقييمات الظاهرة',
    snapshot: 'الملخص المهني',
    relWeight: 'وزن العلاقة',
    noRatings: 'لا توجد تقييمات ظاهرة بعد. يجب أن تبقى النتيجة 3.00.',
    scorePath: 'مسار النتيجة',
  },
} as const

type LabKey = keyof typeof LAB_COPY.en

function useLabCopy() {
  const { locale } = useI18n()
  const dict = LAB_COPY[locale === 'ar' ? 'ar' : 'en']
  return (key: LabKey, vars?: Record<string, string | number>) =>
    Object.entries(vars ?? {}).reduce<string>((text, [name, value]) => text.replace(`{${name}}`, String(value)), dict[key])
}

const RELATIONSHIPS = [
  ['worked_with'],
  ['client'],
  ['manager'],
  ['employee'],
  ['supplier'],
  ['met_professionally'],
  ['event_networking'],
] as const

const PRESETS = [
  ['alwaysFive'],
  ['lowCredibility'],
  ['realistic'],
  ['highlyCredible'],
] as const

type SimulateResult = {
  finalScore: number
  startingScore: number
  credibility: number
  weight: number
  relationshipWeight: number
  formula: string
  note: string
  superVoter: {
    active: boolean
    earnedNow: boolean
    suspendedNow: boolean
    peopleInWindow: number
    minPeople: number
    credibilityEarn: number
  }
  steps: Array<{ index: number; oldScore: number; newScore: number; incoming: number }>
}

type CheckResult = {
  note: string
  user: { id: string; name: string; email: string; isSuperVoter: boolean; profilePublic: boolean }
  accuracy: {
    matches: boolean
    storedScore: number
    replayedScore: number
    storedCredibleCount: number
    visibleCount: number
    delta: number
  }
  snapshot: {
    headline: string | null
    previousEmployment: string[]
    education: string[]
    skills: string[]
    languages: string[]
    licenses: string[]
    certifications: string[]
    memberships: string[]
    cvUrl: string | null
  }
  recentRatings: Array<{
    id: string
    r: number
    relationship: string
    raterCredibility: number
    relationshipWeight: number
    isSuperVoter: boolean
  }>
  steps: Array<{ index: number; newScore: number }>
}

const LAB_PROFILES = [
  ['lab-profile-one-five'],
  ['lab-profile-super-colleague'],
  ['lab-profile-event'],
  ['lab-profile-built'],
] as const

const selectClass = 'h-11 w-full rounded-lg border border-white/10 bg-input/30 px-3 text-sm'

export function AdminReputationLab() {
  const [incoming, setIncoming] = useState(5)
  const [count, setCount] = useState(1)
  const [relationship, setRelationship] = useState<(typeof RELATIONSHIPS)[number][0]>('worked_with')
  const [preset, setPreset] = useState<(typeof PRESETS)[number][0]>('alwaysFive')
  const [uniquePeople, setUniquePeople] = useState(1)
  const [superVoterNow, setSuperVoterNow] = useState(false)
  const [simulation, setSimulation] = useState<SimulateResult | null>(null)
  const [userId, setUserId] = useState('')
  const [check, setCheck] = useState<CheckResult | null>(null)
  const [busy, setBusy] = useState<'simulate' | 'check' | null>(null)
  const [error, setError] = useState('')
  const lab = useLabCopy()

  async function runSimulation() {
    setBusy('simulate')
    setError('')
    try {
      const result = await api<SimulateResult>('/admin/reputation-lab/simulate', {
        method: 'POST',
        body: JSON.stringify({
          incoming,
          count,
          relationship,
          preset,
          uniquePeople,
          currentlySuperVoter: superVoterNow,
        }),
      })
      setSimulation(result)
    } catch (cause) {
      setError(errorMessage(cause, lab('simulationFailed')))
    } finally {
      setBusy(null)
    }
  }

  async function runCheck() {
    const id = userId.trim()
    if (!id) return
    setBusy('check')
    setError('')
    try {
      const result = await api<CheckResult>(`/admin/reputation-lab/check/${encodeURIComponent(id)}`)
      setCheck(result)
    } catch (cause) {
      setCheck(null)
      setError(errorMessage(cause, lab('checkFailed')))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid gap-8">
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        {lab('internalNote')}
      </p>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <section className="grid gap-4">
        <h3 className="font-serif text-lg">{lab('simulationTitle')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>{lab('starsGiven')} — {incoming.toFixed(1)}</FieldLabel>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={incoming}
              onChange={(event) => setIncoming(Number(event.target.value))}
            />
          </Field>
          <Field>
            <FieldLabel>{lab('timesApplied')} — {count}</FieldLabel>
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={count}
              onChange={(event) => {
                const next = Number(event.target.value)
                setCount(next)
                setUniquePeople(next)
              }}
            />
          </Field>
          <Field>
            <FieldLabel>{lab('relationship')}</FieldLabel>
            <select className={selectClass} value={relationship} onChange={(event) => setRelationship(event.target.value as typeof relationship)}>
              {RELATIONSHIPS.map(([value]) => (
                <option key={value} value={value}>{lab(`rel_${value}`)}</option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel>{lab('raterHistory')}</FieldLabel>
            <select className={selectClass} value={preset} onChange={(event) => setPreset(event.target.value as typeof preset)}>
              {PRESETS.map(([value]) => (
                <option key={value} value={value}>{lab(`preset_${value}`)}</option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel>{lab('peopleInWindow')}</FieldLabel>
            <Input
              type="number"
              min={0}
              max={100000}
              value={uniquePeople}
              onChange={(event) => setUniquePeople(Number(event.target.value))}
              className="bg-input/30"
            />
          </Field>
          <Field>
            <FieldLabel>{lab('alreadySuperVoter')}</FieldLabel>
            <select
              className={selectClass}
              value={superVoterNow ? 'yes' : 'no'}
              onChange={(event) => setSuperVoterNow(event.target.value === 'yes')}
            >
              <option value="no">{lab('no')}</option>
              <option value="yes">{lab('yes')}</option>
            </select>
          </Field>
        </div>
        <Button type="button" disabled={busy != null} onClick={() => void runSimulation()}>
          {busy === 'simulate' ? lab('running') : lab('runSimulation')}
        </Button>
        {simulation ? <SimulationCard result={simulation} /> : null}
      </section>

      <section className="grid gap-4 border-t border-white/10 pt-6">
        <h3 className="font-serif text-lg">{lab('checkTitle')}</h3>
        <p className="text-sm text-muted-foreground">
          {lab('checkHelp')}
        </p>
        <div className="flex flex-wrap gap-2">
          {LAB_PROFILES.map(([id]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={userId === id ? 'default' : 'outline'}
              disabled={busy != null}
              onClick={() => {
                setUserId(id)
                setBusy('check')
                setError('')
                void api<CheckResult>(`/admin/reputation-lab/check/${encodeURIComponent(id)}`)
                  .then(setCheck)
                  .catch((cause: unknown) => {
                    setCheck(null)
                    setError(errorMessage(cause, lab('checkFailed')))
                  })
                  .finally(() => setBusy(null))
              }}
            >
              {lab(`profile_${id}`)}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder={lab('userId')}
            aria-label={lab('userId')}
            className="max-w-md bg-input/30"
          />
          <Button type="button" variant="outline" disabled={busy != null || !userId.trim()} onClick={() => void runCheck()}>
            {busy === 'check' ? lab('checking') : lab('checkProfile')}
          </Button>
        </div>
        {check ? <CheckCard result={check} /> : null}
      </section>
    </div>
  )
}

function SimulationCard({ result }: { result: SimulateResult }) {
  const lab = useLabCopy()
  const first = result.steps[0]
  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-end gap-6">
        <ScoreMark label={lab('finalScore')} value={result.finalScore} />
        <ScoreMark label={lab('startsAt')} value={result.startingScore} />
        {first ? <ScoreMark label={lab('afterFirst')} value={first.newScore} /> : null}
      </div>
      <p className="text-sm text-muted-foreground">{result.formula}</p>
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="outline">{lab('credibility')} {result.credibility}</Badge>
        <Badge variant="outline">{lab('relationship')} {result.relationshipWeight}</Badge>
        <Badge variant="outline">{lab('weight')} {result.weight}</Badge>
        <Badge variant={result.superVoter.active ? 'default' : 'outline'}>
          {lab('superVoter')} {result.superVoter.active ? lab('active') : lab('notActive')}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        {lab('needs', { min: result.superVoter.minPeople, cred: result.superVoter.credibilityEarn })}{' '}
        {lab('hasPeople', { people: result.superVoter.peopleInWindow, cred: result.credibility })}
        {result.superVoter.earnedNow ? ` ${lab('wouldEarn')}` : ''}
        {result.superVoter.suspendedNow ? ` ${lab('wouldSuspend')}` : ''}
      </p>
      <ScoreTrail steps={result.steps} />
      <p className="text-xs text-muted-foreground">{result.note}</p>
    </div>
  )
}

function CheckCard({ result }: { result: CheckResult }) {
  const lab = useLabCopy()
  const snapshotRows = [
    [lab('headline'), result.snapshot.headline],
    [lab('previousEmployment'), result.snapshot.previousEmployment.join(', ')],
    [lab('education'), result.snapshot.education.join(', ')],
    [lab('skills'), result.snapshot.skills.join(', ')],
    [lab('languages'), result.snapshot.languages.join(', ')],
    [lab('licenses'), result.snapshot.licenses.join(', ')],
    [lab('certifications'), result.snapshot.certifications.join(', ')],
    [lab('memberships'), result.snapshot.memberships.join(', ')],
    [lab('cv'), result.snapshot.cvUrl],
  ]
  return (
    <div className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="font-medium">{result.user.name}</p>
          <p className="text-sm text-muted-foreground">{result.user.email}</p>
        </div>
        <Badge variant={result.accuracy.matches ? 'default' : 'outline'}>
          {result.accuracy.matches ? lab('matches') : `${lab('mismatch')} ${result.accuracy.delta}`}
        </Badge>
        {result.user.isSuperVoter ? <Badge>{lab('superVoter')}</Badge> : null}
      </div>
      <div className="flex flex-wrap gap-6">
        <ScoreMark label={lab('storedScore')} value={result.accuracy.storedScore} />
        <ScoreMark label={lab('replayedScore')} value={result.accuracy.replayedScore} />
        <ScoreMark label={lab('visibleRatings')} value={result.accuracy.visibleCount} integer />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">{lab('snapshot')}</p>
        <dl className="grid gap-2 text-sm">
          {snapshotRows.map(([label, value]) => (
            <div key={label} className="grid gap-1 sm:grid-cols-[12rem_1fr]">
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
      {result.recentRatings.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-1 pe-3 font-medium">R</th>
                <th className="py-1 pe-3 font-medium">{lab('relationship')}</th>
                <th className="py-1 pe-3 font-medium">{lab('credibility')}</th>
                <th className="py-1 pe-3 font-medium">{lab('relWeight')}</th>
                <th className="py-1 font-medium">{lab('superVoter')}</th>
              </tr>
            </thead>
            <tbody>
              {result.recentRatings.map((rating) => (
                <tr key={rating.id} className="border-t border-white/10">
                  <td className="py-1 pe-3">{rating.r.toFixed(2)}</td>
                  <td className="py-1 pe-3">{rating.relationship}</td>
                  <td className="py-1 pe-3">{rating.raterCredibility.toFixed(2)}</td>
                  <td className="py-1 pe-3">{rating.relationshipWeight.toFixed(2)}</td>
                  <td className="py-1">{rating.isSuperVoter ? lab('yes') : lab('no')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{lab('noRatings')}</p>
      )}
      <ScoreTrail steps={result.steps.map((step) => ({ index: step.index, newScore: step.newScore }))} />
      <p className="text-xs text-muted-foreground">{result.note}</p>
    </div>
  )
}

function ScoreMark({ label, value, integer = false }: { label: string; value: number; integer?: boolean }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="font-serif text-3xl">{integer && Number.isInteger(value) ? value : value.toFixed(2)}</p>
    </div>
  )
}

function ScoreTrail({ steps }: { steps: Array<{ index: number; newScore: number }> }) {
  const lab = useLabCopy()
  if (!steps.length) return null
  const width = 280
  const height = 72
  const min = 1
  const max = 5
  const points = steps.map((step, index) => {
    const x = steps.length === 1 ? width / 2 : (index / (steps.length - 1)) * width
    const y = height - ((step.newScore - min) / (max - min)) * (height - 8) - 4
    return `${x},${y}`
  })
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full max-w-md" role="img" aria-label={lab('scorePath')}>
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points.join(' ')} className="text-amber-200" />
    </svg>
  )
}
