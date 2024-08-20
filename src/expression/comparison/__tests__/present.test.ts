import { value } from '../../../operand'
import { present } from '../present'

describe('expression / comparison / present', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(1), true],
      [value(1.1), true],
      [value('1'), true],
      [value('c'), true],
      [value(true), true],
      [value(false), true],
      // Falsy
      [value(null), false],
    ])('%p should evaluate as %p', (operand, expected) => {
      expect(present(operand).evaluate()).toBe(expected)
    })
  })
})
