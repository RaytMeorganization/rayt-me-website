import assert from 'node:assert/strict'
import test from 'node:test'

import { checkoutSeatsForPlan, settingsCheckoutPath } from './get-started-funnel'

test('checkoutSeatsForPlan ignores employee count for Pro', () => {
  assert.equal(checkoutSeatsForPlan('pro', 10), 1)
})

test('settingsCheckoutPath omits employees for Pro checkout', () => {
  assert.equal(
    settingsCheckoutPath({
      plan: 'pro',
      interval: 'month',
      employees: 10,
      autoCheckout: true,
    }),
    '/settings?tab=plan&plan=pro&interval=month&checkout=1',
  )
})

test('settingsCheckoutPath keeps employees for Business', () => {
  const path = settingsCheckoutPath({
    plan: 'business',
    interval: 'year',
    employees: 10,
    autoCheckout: true,
  })
  assert.match(path, /employees=10/)
  assert.match(path, /checkout=1/)
})
