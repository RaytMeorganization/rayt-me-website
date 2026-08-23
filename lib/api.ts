import type { ApiEnvelope } from '@/lib/types'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === 'undefined'
    ? process.env.API_PROXY_TARGET || 'http://localhost:4000'
    : '/backend')

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function api<T>(
  path: string,
  init: RequestInit = {},
  options: { server?: boolean; retried?: boolean } = {},
): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('content-type')) headers.set('content-type', 'application/json')
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
    cache: options.server ? 'no-store' : init.cache,
  })

  if (response.status === 401 && !options.server && !options.retried && path !== '/auth/refresh') {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
    if (refreshed.ok) return api<T>(path, init, { ...options, retried: true })
  }

  let body: ApiEnvelope<T> | null = null
  try {
    body = (await response.json()) as ApiEnvelope<T>
  } catch {
    throw new ApiError(response.ok ? 'Invalid API response' : `Request failed (${response.status})`, response.status)
  }
  if (!response.ok || !body.success) {
    const message = typeof body.error === 'string' ? body.error : body.error?.message
    throw new ApiError(message || `Request failed (${response.status})`, response.status)
  }
  return body.data
}

export function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
