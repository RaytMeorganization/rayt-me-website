export type ScoreDirection = 'positive' | 'negative' | 'unchanged' | 'unavailable'

export type HistoryPoint = {
  at: string
  score: number | null
  kind: 'engine_baseline' | 'recorded' | 'carried_forward' | 'omitted'
  moderated: boolean
}

export type ScoreMovement = {
  startingScore: number | null
  endingScore: number | null
  storedScore: number
  change: number | null
  direction: ScoreDirection
  startingBasis: 'recorded' | 'engine_baseline' | 'unavailable'
  endingBasis: 'recorded' | 'engine_baseline' | 'unavailable'
  joinedDuringPeriod: boolean
  historyAvailableFrom: string
  truncated?: boolean
}

export type EmployeeReputation = ScoreMovement & {
  employee: {
    id: string
    name: string
    avatarUrl: string | null
    jobTitle: string | null
    isVerified: boolean
    employmentStatus: 'working' | 'not_working' | 'open_to_work' | null
    score: number
    credibleRatingCount: number
  }
  period: { from: string | null; to: string | null; timeZone: string }
}

export type BusinessRatingItem = {
  id: string
  relationship: string
  categoryScores: Record<string, number> | null
  r: number
  attributionTitle: string | null
  isSuperVoter: boolean
  comment: string | null
  createdAt: string
  channel: string
  ratingCity: string | null
  ratingCountry: string | null
  direction: 'received' | 'given' | 'internal'
  target: { id: string; name: string } | null
  rater?: { id: string; name: string } | null
}

export type PeriodAnalytics = {
  period: string
  timeZone: string
  current: {
    from: string
    to: string
    fromDate: string
    toDate: string
    averageReputation: number | null
    ratingCount: number
    cohortSize: number
  }
  previous: {
    from: string
    to: string
    fromDate: string
    toDate: string
    averageReputation: number | null
    ratingCount: number
    cohortSize: number
  } | null
  change: number | null
  direction: ScoreDirection
  comparable: boolean
}

export type AnalyticsPeriod = 'current_month' | 'previous_month' | 'current_year' | 'custom'

export function formatScoreValue(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toFixed(2)
}

export function formatScoreChange(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—'
  const rounded = value.toFixed(2)
  return value > 0 ? `+${rounded}` : rounded
}
