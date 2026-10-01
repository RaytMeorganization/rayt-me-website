'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { api, errorMessage } from '@/lib/api'

const RELATIONSHIPS = [
  ['worked_with', 'Colleague — worked with (0.90)'],
  ['client', 'Client (1.00)'],
  ['manager', 'Manager (1.15)'],
  ['employee', 'Employee (0.95)'],
  ['supplier', 'Supplier (0.80)'],
  ['met_professionally', 'Met professionally (0.55)'],
  ['event_networking', 'Met at an event (0.40)'],
] as const

const PRESETS = [
  ['alwaysFive', 'Always gives 5'],
  ['lowCredibility', 'Low credibility (mostly 5s)'],
  ['realistic', 'Realistic mix'],
  ['highlyCredible', 'Highly credible raters'],
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
  ['lab-profile-one-five', 'Noor — one 5 from an always-5 colleague'],
  ['lab-profile-super-colleague', 'Hadi — one 5 from a Super Voter colleague'],
  ['lab-profile-event', 'Lina — one 5 from an always-5 event contact'],
  ['lab-profile-built', 'Omar — eight mixed colleague ratings'],
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
      setError(errorMessage(cause, 'Simulation failed'))
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
      setError(errorMessage(cause, 'Profile check failed'))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="grid gap-8">
      <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        Internal calibration only. Runs the live scoring formula and snapshot shape. It does not save ratings or change profile scores.
      </p>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <section className="grid gap-4">
        <h3 className="font-serif text-lg">Rating and scoring simulation</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Stars they give (R) — {incoming.toFixed(1)}</FieldLabel>
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
            <FieldLabel>How many times this pattern is applied — {count}</FieldLabel>
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
            <FieldLabel>Relationship</FieldLabel>
            <select className={selectClass} value={relationship} onChange={(event) => setRelationship(event.target.value as typeof relationship)}>
              {RELATIONSHIPS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel>Rater history</FieldLabel>
            <select className={selectClass} value={preset} onChange={(event) => setPreset(event.target.value as typeof preset)}>
              {PRESETS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel>Different people rated in 90 days (Super Voter)</FieldLabel>
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
            <FieldLabel>Already a Super Voter</FieldLabel>
            <select
              className={selectClass}
              value={superVoterNow ? 'yes' : 'no'}
              onChange={(event) => setSuperVoterNow(event.target.value === 'yes')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
        </div>
        <Button type="button" disabled={busy != null} onClick={() => void runSimulation()}>
          {busy === 'simulate' ? 'Running…' : 'Run simulation'}
        </Button>
        {simulation ? <SimulationCard result={simulation} /> : null}
      </section>

      <section className="grid gap-4 border-t border-white/10 pt-6">
        <h3 className="font-serif text-lg">Live profile accuracy and snapshot</h3>
        <p className="text-sm text-muted-foreground">
          Replays visible ratings with the same formula and shows the professional snapshot the app would return. Nothing is written.
          Demo profiles are created by the backend seed.
        </p>
        <div className="flex flex-wrap gap-2">
          {LAB_PROFILES.map(([id, label]) => (
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
                    setError(errorMessage(cause, 'Profile check failed'))
                  })
                  .finally(() => setBusy(null))
              }}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="User id"
            className="max-w-md bg-input/30"
          />
          <Button type="button" variant="outline" disabled={busy != null || !userId.trim()} onClick={() => void runCheck()}>
            {busy === 'check' ? 'Checking…' : 'Check profile'}
          </Button>
        </div>
        {check ? <CheckCard result={check} /> : null}
      </section>
    </div>
  )
}

function SimulationCard({ result }: { result: SimulateResult }) {
  const first = result.steps[0]
  return (
    <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-end gap-6">
        <ScoreMark label="Final score" value={result.finalScore} />
        <ScoreMark label="Starts at" value={result.startingScore} />
        {first ? <ScoreMark label="After first rating" value={first.newScore} /> : null}
      </div>
      <p className="text-sm text-muted-foreground">{result.formula}</p>
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="outline">Credibility {result.credibility}</Badge>
        <Badge variant="outline">Relationship {result.relationshipWeight}</Badge>
        <Badge variant="outline">Weight W {result.weight}</Badge>
        <Badge variant={result.superVoter.active ? 'default' : 'outline'}>
          Super Voter {result.superVoter.active ? 'active' : 'not active'}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Needs {result.superVoter.minPeople} different people in 90 days and credibility at least {result.superVoter.credibilityEarn}.
        This rater has {result.superVoter.peopleInWindow} people and credibility {result.credibility}.
        {result.superVoter.earnedNow ? ' They would earn Super Voter on this rating.' : ''}
        {result.superVoter.suspendedNow ? ' Super Voter would be suspended.' : ''}
      </p>
      <ScoreTrail steps={result.steps} />
      <p className="text-xs text-muted-foreground">{result.note}</p>
    </div>
  )
}

function CheckCard({ result }: { result: CheckResult }) {
  const snapshotRows = [
    ['Headline', result.snapshot.headline],
    ['Previous employment', result.snapshot.previousEmployment.join(', ')],
    ['Education', result.snapshot.education.join(', ')],
    ['Skills', result.snapshot.skills.join(', ')],
    ['Languages', result.snapshot.languages.join(', ')],
    ['Licenses', result.snapshot.licenses.join(', ')],
    ['Certifications', result.snapshot.certifications.join(', ')],
    ['Memberships', result.snapshot.memberships.join(', ')],
    ['CV', result.snapshot.cvUrl],
  ] as const
  return (
    <div className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <p className="font-medium">{result.user.name}</p>
          <p className="text-sm text-muted-foreground">{result.user.email}</p>
        </div>
        <Badge variant={result.accuracy.matches ? 'default' : 'outline'}>
          {result.accuracy.matches ? 'Stored score matches replay' : `Mismatch Δ ${result.accuracy.delta}`}
        </Badge>
        {result.user.isSuperVoter ? <Badge>Super Voter</Badge> : null}
      </div>
      <div className="flex flex-wrap gap-6">
        <ScoreMark label="Stored score" value={result.accuracy.storedScore} />
        <ScoreMark label="Replayed score" value={result.accuracy.replayedScore} />
        <ScoreMark label="Visible ratings" value={result.accuracy.visibleCount} />
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Professional snapshot</p>
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
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-1 pe-3 font-medium">R</th>
                <th className="py-1 pe-3 font-medium">Relationship</th>
                <th className="py-1 pe-3 font-medium">Credibility</th>
                <th className="py-1 pe-3 font-medium">Rel. weight</th>
                <th className="py-1 font-medium">Super Voter</th>
              </tr>
            </thead>
            <tbody>
              {result.recentRatings.map((rating) => (
                <tr key={rating.id} className="border-t border-white/10">
                  <td className="py-1 pe-3">{rating.r.toFixed(2)}</td>
                  <td className="py-1 pe-3">{rating.relationship}</td>
                  <td className="py-1 pe-3">{rating.raterCredibility.toFixed(2)}</td>
                  <td className="py-1 pe-3">{rating.relationshipWeight.toFixed(2)}</td>
                  <td className="py-1">{rating.isSuperVoter ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No visible ratings yet. Score should stay at 3.00.</p>
      )}
      <ScoreTrail steps={result.steps.map((step) => ({ index: step.index, newScore: step.newScore }))} />
      <p className="text-xs text-muted-foreground">{result.note}</p>
    </div>
  )
}

function ScoreMark({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="font-serif text-3xl">{Number.isInteger(value) && label === 'Visible ratings' ? value : value.toFixed(2)}</p>
    </div>
  )
}

function ScoreTrail({ steps }: { steps: Array<{ index: number; newScore: number }> }) {
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
    <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full max-w-md" role="img" aria-label="Score path">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={points.join(' ')} className="text-amber-200" />
    </svg>
  )
}
