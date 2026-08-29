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
  averageRating: number
  averageReputation: number
  ratingCount: number
}

export interface BusinessUsage {
  plan: string | null
  status: string | null
  currentPeriodEnd: string | null
  usage: { members: number; pendingInvites: number }
  entitlements: { key: string; value: number }[]
}
