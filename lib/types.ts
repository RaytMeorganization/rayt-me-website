export type Locale = 'en' | 'ar'
export type AccountType = 'professional' | 'student'
export type Role = 'user' | 'admin' | 'business'
export type CheckStatus = 'pending' | 'verified' | 'rejected'

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  error?: string | { message?: string; code?: string }
}

export interface User {
  id: string
  email: string
  personalEmail?: string | null
  workEmail?: string | null
  universityEmail?: string | null
  phone?: string | null
  name: string
  avatarUrl?: string | null
  accountType: AccountType
  role?: Role
  jobTitle?: string | null
  company?: string | null
  industry?: string | null
  bio?: string | null
  university?: string | null
  fieldOfStudy?: string | null
  city?: string | null
  country?: string | null
  isVerified: boolean
  workEmailStatus: CheckStatus
  personalEmailStatus: CheckStatus
  phoneStatus: CheckStatus
  universityEmailStatus: CheckStatus
  tier: 'basic' | 'pro' | 'business'
  theme?: string | null
  emailPublic: boolean
  phonePublic: boolean
  locationPublic: boolean
  companyPublic: boolean
  profilePublic: boolean
  professionKey?: string | null
  employmentStatus?: 'working' | 'not_working' | 'open_to_work' | null
  employmentStatusVisibility?: 'public' | 'private'
}

export interface PublicProfile {
  id: string
  name: string
  avatarUrl?: string | null
  accountType: AccountType
  isVerified: boolean
  jobTitle?: string | null
  bio?: string | null
  reputation: {
    score: number
    credibleRatingCount: number
    tier: 'basic' | 'pro' | 'business'
  }
  theme?: string | null
  education: {
    university?: string | null
    fieldOfStudy?: string | null
  } | null
  company?: string | null
  location: {
    city?: string | null
    country?: string | null
  } | null
  email?: string | null
  phone?: string | null
  phonePrivate?: boolean
}

export interface Verification {
  id: string
  type: string
  status: CheckStatus
  user?: Pick<User, 'id' | 'name' | 'email'>
  createdAt?: string
}

export interface Organization {
  id: string
  name: string
  description?: string | null
  website?: string | null
  logoUrl?: string | null
  brandColor?: string | null
}

export interface BusinessReputation {
  averageReputation: number
  averageRating: number | null
  ratingCount: number
  memberCount?: number
  verifiedMemberCount?: number
  lowestReputation?: number | null
  highestReputation?: number | null
}

export type AnalyticsPeriodPreset = 'current_month' | 'previous_month' | 'current_year' | 'custom'

export interface BusinessAnalytics {
  timezone: string
  window: {
    preset: AnalyticsPeriodPreset
    from: string
    to: string
    previousFrom: string
    previousTo: string
    employeeId: string | null
  }
  snapshot: {
    averageReputation: number
    highestReputation: number | null
    lowestReputation: number | null
    verifiedMemberCount: number
    memberCount: number
    credibleRatingCount: number
  }
  period: {
    ratingsReceived: number
    ratingsGiven: number
    reputation: number | null
    categoryAverages: { key: string; average: number | null; sampleSize: number }[]
  }
  previousPeriod: {
    ratingsReceived: number
    ratingsGiven: number
    reputation: number | null
  }
  comparison: {
    reputationChange: number | null
    ratingsReceivedChange: number
    ratingsGivenChange: number
  }
  trend: { at: string; score: number; employeeId: string; ratingId: string }[]
  volume: { bucket: string; grain: 'day' | 'week' | 'month'; received: number; given: number }[]
}

export interface EmployeeReputationDetail {
  employee: {
    id: string
    name: string
    email: string
    jobTitle?: string | null
    company?: string | null
    avatarUrl?: string | null
    isVerified: boolean
    score: unknown
    credibleRatingCount: number
    employmentStatus?: 'working' | 'not_working' | 'open_to_work' | null
  }
  startingScore: number
  currentScore: number
  change: number
  credibleRatingCount: number
  historyAvailable: boolean
  history: { at: string; score: number; kind: 'starting' | 'observation'; ratingId: string | null }[]
}

export interface BusinessRatingItem {
  id: string
  relationship: string
  categoryScores: Record<string, number> | unknown
  r: number | string
  attributionTitle: string | null
  comment: string | null
  createdAt: string
  direction: 'given' | 'received'
  targetUserId?: string
  rater?: { id: string; name: string } | null
  target?: { id: string; name: string } | null
}

export interface PaginatedBusinessRatings {
  items: BusinessRatingItem[]
  nextCursor: string | null
}

export interface BusinessUsage {
  plan: string | null
  status: string | null
  currentPeriodEnd: string | null
  usage: { members: number; pendingInvites: number }
  /** Purchased Business seats and how many members + pending invites use them. */
  seats?: { purchased: number | null; used: number }
  entitlements: { key: string; value: number }[]
}
