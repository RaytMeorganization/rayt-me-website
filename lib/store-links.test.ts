import assert from 'node:assert/strict'
import test from 'node:test'
import {
  APP_STORE_URL,
  IOS_APP_STORE_APP_ID,
  PLAY_STORE_URL,
  storeUrlForUserAgent,
} from './store-links'

test('iPhone and iPad agents open the public Rayt Me App Store listing', () => {
  assert.equal(IOS_APP_STORE_APP_ID, '6821832114')
  assert.match(APP_STORE_URL, /id6821832114/)
  assert.equal(
    storeUrlForUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)'),
    APP_STORE_URL,
  )
  assert.equal(storeUrlForUserAgent('Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)'), APP_STORE_URL)
})

test('Android agents stay on Google Play, not the App Store listing', () => {
  assert.equal(storeUrlForUserAgent('Mozilla/5.0 (Linux; Android 14)'), PLAY_STORE_URL)
  assert.doesNotMatch(PLAY_STORE_URL, /id6821832114/)
})

test('non-Android agents, including desktop, use the iOS listing only', () => {
  assert.equal(storeUrlForUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)'), APP_STORE_URL)
  assert.equal(storeUrlForUserAgent(null), APP_STORE_URL)
})
