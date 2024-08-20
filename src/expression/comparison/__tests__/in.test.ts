import { collection, value } from '../../../operand'
import { In } from '../in'

describe('expression / comparison / in', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(1), collection([value(0), value(1)]), true],
      [collection([value(1)]), value(1), true],
      [value('1'), collection([value('1')]), true],
      [collection([value(true)]), value(true), true],
      [value(null), collection([value(null)]), true],
      [value(undefined), collection([value(1), value(undefined)]), true],
      // Falsy
      [value(1), collection([value(2)]), false],
      [collection([value(2)]), value(1), false],
      [value('bogus'), collection([value('lorem')]), false],
      [collection([value(false)]), value(true), false],
      [value(null), collection([value(1)]), false],
      [value(1), value(1), false],
      [value(null), value(null), false],
    ])('%p, %p should evaluate as %p', (left, right, expected) => {
      expect(In(left, right).evaluate()).toBe(expected)
    })
  })
})
