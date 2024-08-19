import { collection, value } from '../../../operand'
import { gt } from '../gt'

describe('expression / comparison / greater than', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(2), value(1), true],
      [value(1.2), value(1.1), true],
      // Falsy
      [value(1), value(1), false],
      [value(1.1), value(1.1), false],
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
      expect(gt(left, right).evaluate()).toBe(expected)
    })
  })
})
