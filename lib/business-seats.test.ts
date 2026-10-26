import assert from 'node:assert/strict'
import test from 'node:test'
import { BUSINESS_MIN_SEATS, clampBusinessSeats } from './business-seats'

test('Business seats never go below the team minimum or above the cap', () => {
  assert.equal(BUSINESS_MIN_SEATS, 3)
  assert.equal(clampBusinessSeats(1), 3)
  assert.equal(clampBusinessSeats(0), 3)
  assert.equal(clampBusinessSeats(Number.NaN), 3)
  assert.equal(clampBusinessSeats(7.9), 7)
  assert.equal(clampBusinessSeats(50_000), 10_000)
})
