import { collection, value } from '../../../operand'
import { ge } from '../ge'

describe('expression / comparison / greater than or equal', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(1), value(1), true],
      [value(1.1), value(1.1), true],
      [value(2), value(1), true],
      [value(1.2), value(1.1), true],
      // Falsy
      [value(1), value(2), false],
      [value(1), value('1'), false],
      [value(1), value(true), false],
      [value(1.1), value('1'), false],
      [value(1.1), value(true), false],
      [value('1'), value(true), false],
      [value(null), value(1), false],
      [value(1), value(null), false],
      [collection([value(1)]), collection([value(1)]), false],
      [value(1), collection([value(1)]), false],
    ])('%p, %p should evaluate as %p', (left, right, expected) => {
      expect(ge(left, right).evaluate()).toBe(expected)
    })
  })
})
