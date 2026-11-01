export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window === 'undefined'
    ? process.env.API_PROXY_TARGET || 'http://localhost:4000'
    : '/backend')

const REFRESH_CHANNEL = 'rayt-auth-refresh'
const REFRESH_STORAGE_KEY = 'rayt-auth-refresh-epoch'

let refreshInFlight: Promise<boolean> | null = null

/** Exported for unit tests — resets module single-flight state. */
export function __resetRefreshSingleFlightForTests() {
  refreshInFlight = null
}

function notifyOtherTabs() {
  if (typeof window === 'undefined') return
  const epoch = String(Date.now())
  try {
    window.localStorage.setItem(REFRESH_STORAGE_KEY, epoch)
  } catch {
    /* private mode */
  }
  try {
    const channel = new BroadcastChannel(REFRESH_CHANNEL)
    channel.postMessage({ type: 'refreshed', epoch })
    channel.close()
  } catch {
    /* unsupported */
  }
}

/**
 * One shared in-flight refresh for this tab; cross-tab callers are notified via
 * storage/BroadcastChannel so a second tab does not race the same cookie alone.
 */
export async function refreshSessionSingleFlight(
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const refreshed = await fetchImpl(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (refreshed.ok) {
      notifyOtherTabs()
      return true
    }
    return false
  })().finally(() => {
    refreshInFlight = null
  })

  return refreshInFlight
}
