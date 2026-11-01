import assert from 'node:assert/strict'
import test from 'node:test'
import {
  __resetRefreshSingleFlightForTests,
  refreshSessionSingleFlight,
} from './api-refresh.ts'

test('five parallel 401 refreshes share one /auth/refresh call', async () => {
  __resetRefreshSingleFlightForTests()
  let refreshCalls = 0
  const fetchImpl = async (input: RequestInfo | URL) => {
    const url = String(input)
    if (url.includes('/auth/refresh')) {
      refreshCalls += 1
      await new Promise((r) => setTimeout(r, 20))
      return new Response(JSON.stringify({ success: true, data: { refreshed: true } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    }
    return new Response('nope', { status: 500 })
  }

  const results = await Promise.all(
    Array.from({ length: 5 }, () => refreshSessionSingleFlight(fetchImpl as typeof fetch)),
  )

  assert.deepEqual(results, [true, true, true, true, true])
  assert.equal(refreshCalls, 1)
})

test('a second overlapping refresh waits on the same promise (no extra call)', async () => {
  __resetRefreshSingleFlightForTests()
  let refreshCalls = 0
  const fetchImpl = async () => {
    refreshCalls += 1
    await new Promise((r) => setTimeout(r, 30))
    return new Response('{}', { status: 200 })
  }

  const first = refreshSessionSingleFlight(fetchImpl as typeof fetch)
  const second = refreshSessionSingleFlight(fetchImpl as typeof fetch)
  assert.equal(await first, true)
  assert.equal(await second, true)
  assert.equal(refreshCalls, 1)
})
