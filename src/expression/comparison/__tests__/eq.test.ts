import { collection, value } from '../../../operand'
import { eq } from '../eq'

describe('expression / comparison / equal', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(1), value(1), true],
      [value(1.1), value(1.1), true],
      [value('1'), value('1'), true],
      [value(true), value(true), true],
      [value(false), value(false), true],
      [value(null), value(null), true],
      [value(undefined), value(undefined), true],
      // Falsy
      [value(1), value(1.1), false],
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
      expect(eq(left, right).evaluate()).toBe(expected)
    })
  })
})
