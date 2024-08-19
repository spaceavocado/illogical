import { collection, value } from '../../../operand'
import { ne } from '../ne'

describe('expression / comparison / not equal', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(1), value(1.1), true],
      [value(1), value('1'), true],
      [value(1), value(true), true],
      [value(1.1), value('1'), true],
      [value(1.1), value(true), true],
      [value('1'), value(true), true],
      [value(null), value(1), true],
      [value(1), value(null), true],
      [value(undefined), value(null), true],
      [collection([value(1)]), collection([value(1)]), true],
      [value(1), collection([value(1)]), true],
      // Falsy
      [value(1), value(1), false],
      [value(1.1), value(1.1), false],
      [value('1'), value('1'), false],
      [value(true), value(true), false],
      [value(false), value(false), false],
      [value(null), value(null), false],
    ])('%p, %p should evaluate as %p', (left, right, expected) => {
      expect(ne(left, right).evaluate()).toBe(expected)
    })
  })
})
