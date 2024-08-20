import { collection, value } from '../../../operand'
import { prefix } from '../prefix'

describe('expression / comparison / prefix', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value('bo'), value('bogus'), true],
      [value('b'), value('bogus'), true],
      [value('b'), value('b'), true],
      // Falsy
      [value('ogus'), value('bogus'), false],
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
      expect(prefix(left, right).evaluate()).toBe(expected)
    })
  })
})
