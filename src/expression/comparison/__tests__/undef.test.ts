import { value } from '../../../operand'
import { undef } from '../undef'

describe('expression / comparison / undefined', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(undefined), true],
      // Falsy
      [value(1), false],
      [value(1.1), false],
      [value('1'), false],
      [value('c'), false],
      [value(true), false],
      [value(false), false],
    ])('%p should evaluate as %p', (operand, expected) => {
      expect(undef(operand).evaluate()).toBe(expected)
    })
  })
})
