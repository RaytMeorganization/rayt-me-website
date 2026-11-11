export const RATING_COMMENT_MAX = 150

export const WEB_RATING_RELATIONSHIPS = [
  'worked_with',
  'client',
  'supplier',
  'manager',
  'employee',
  'met_professionally',
  'event_networking',
] as const

export type WebRatingRelationship = (typeof WEB_RATING_RELATIONSHIPS)[number]

export const RELATIONSHIP_LABELS_EN: Record<WebRatingRelationship, string> = {
  worked_with: 'Worked with',
  client: 'Client',
  supplier: 'Supplier',
  manager: 'Manager',
  employee: 'Employee',
  met_professionally: 'Met professionally',
  event_networking: 'Event / networking',
}

export const RELATIONSHIP_LABELS_AR: Record<WebRatingRelationship, string> = {
  worked_with: 'عملت معه/معها',
  client: 'عميل',
  supplier: 'مورّد',
  manager: 'مدير',
  employee: 'موظف',
  met_professionally: 'تعارف مهني',
  event_networking: 'فعالية / تواصل',
}

export const RATING_CATEGORIES = [
  'professionalism',
  'communication',
  'reliability',
  'knowledge',
  'collaboration',
] as const

export type RatingCategory = (typeof RATING_CATEGORIES)[number]

export type CategoryScores = Record<RatingCategory, number>

export function snapRatingScore(value: number) {
  return Math.round(Math.max(1, Math.min(5, value)) * 2) / 2
}

export function emptyCategoryScores(score = 4): CategoryScores {
  const snapped = snapRatingScore(score)
  return {
    professionalism: snapped,
    communication: snapped,
    reliability: snapped,
    knowledge: snapped,
    collaboration: snapped,
  }
}

export function scoresFromOverall(overall: number): CategoryScores {
  return emptyCategoryScores(overall)
}

export function averageCategoryScores(scores: CategoryScores) {
  const values = Object.values(scores)
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

export function clipRatingComment(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, RATING_COMMENT_MAX)
}

/** Cloudflare always-pass test site key for local/dev when unset. */
export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'

export function turnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || TURNSTILE_TEST_SITE_KEY
}
