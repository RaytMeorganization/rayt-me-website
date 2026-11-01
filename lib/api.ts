import type { ApiEnvelope } from '@/lib/types'
import { API_URL, refreshSessionSingleFlight } from '@/lib/api-refresh'

export { API_URL, refreshSessionSingleFlight } from '@/lib/api-refresh'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
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
    const okRefresh = await refreshSessionSingleFlight()
    if (okRefresh) return api<T>(path, init, { ...options, retried: true })
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
