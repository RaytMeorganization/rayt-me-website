import assert from 'node:assert/strict'
import test from 'node:test'
import { answerRaytmeBot } from './raytme-bot-corpus'

test('Pro price comes from the plan rule', () => {
  const answer = answerRaytmeBot('What is the Pro price?', 'en')
  assert.match(answer.text, /\$27/)
  assert.equal(answer.href, '/')
})

test('one 5-star rating does not become a score of 5', () => {
  const answer = answerRaytmeBot('Does one 5-star rating make my score 5?', 'en')
  assert.match(answer.text, /starts at 3/i)
  assert.match(answer.text, /does not make the score 5/i)
})

test('Super Voter is not a weight multiplier', () => {
  const answer = answerRaytmeBot('Is Super Voter a 1.5 weight multiplier?', 'en')
  assert.match(answer.text, /badge/i)
  assert.match(answer.text, /does not multiply rating weight/i)
})

test('a privacy-only phrase quotes the privacy page', () => {
  const answer = answerRaytmeBot(
    'Do you share personal information for cross-context behavioral advertising?',
    'en',
  )
  assert.equal(answer.href, '/privacy')
  assert.match(answer.text, /cross-context behavioral advertising/i)
  assert.doesNotMatch(answer.text, /only answer from what is published/i)
})
