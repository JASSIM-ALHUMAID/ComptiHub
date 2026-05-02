import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatSubmittedDate } from './suggestionsUtils.js'

test('formatSubmittedDate formats API ISO timestamps', () => {
  assert.equal(formatSubmittedDate('2026-05-02T13:04:24.216Z'), '02 May 2026')
})

test('formatSubmittedDate formats date-only values', () => {
  assert.equal(formatSubmittedDate('2026-05-02'), '02 May 2026')
})
