import assert from 'node:assert/strict'
export { afterEach, beforeEach, describe, it } from 'node:test'

export function expect(actual) {
  return {
    toBe(expected) {
      assert.equal(actual, expected)
    },
    toEqual(expected) {
      assert.deepEqual(actual, expected)
    },
    toBeDefined() {
      assert.notEqual(actual, undefined)
    },
    toContain(expected) {
      assert.equal(actual.includes(expected), true)
    },
    toThrow(expected) {
      assert.throws(actual, expected)
    },
    not: {
      toBe(expected) {
        assert.notEqual(actual, expected)
      },
      toContain(expected) {
        assert.equal(actual.includes(expected), false)
      },
    },
    rejects: {
      async toThrow(expected) {
        await assert.rejects(actual, expected)
      },
    },
  }
}
