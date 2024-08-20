import { collection, value } from '../../../operand'
import { suffix } from '../suffix'

describe('expression / comparison / suffix', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value('bogus'), value('us'), true],
      [value('bogus'), value('s'), true],
      [value('b'), value('b'), true],
      // Falsy
      [value('bogus'), value('bogu'), false],
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
      expect(suffix(left, right).evaluate()).toBe(expected)
    })
  })
})
