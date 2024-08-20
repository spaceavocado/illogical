import { collection, value } from '../../../operand'
import { notIn } from '../not-in'

describe('expression / comparison / not in', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(2), collection([value(0), value(1)]), true],
      [collection([value(2)]), value(1), true],
      [value('2'), collection([value('1')]), true],
      [collection([value(true)]), value(false), true],
      [value(null), collection([value(1)]), true],
      [value(1), value(1), true],
      [value(null), value(null), true],
      // Falsy
      [value(1), collection([value(1)]), false],
      [collection([value(1)]), value(1), false],
      [value('bogus'), collection([value('bogus')]), false],
      [collection([value(true)]), value(true), false],
      [value(null), collection([value(null)]), false],
    ])('%p, %p should evaluate as %p', (left, right, expected) => {
      expect(notIn(left, right).evaluate()).toBe(expected)
    })
  })
})
