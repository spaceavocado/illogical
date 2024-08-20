import { isEvaluable } from '../../../evaluable'
import { reference, value } from '../../../operand'
import { not } from '../not'

describe('expression / logical / not', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [value(false), true],
      // Falsy
      [value(true), false],
    ])('%p should evaluate as %p', (operand, expected) => {
      const expression = not(operand)
      expect(expression.evaluate({})).toBe(expected)
    })
  })

  describe('evaluate - invalid operand', () => {
    it.each([[value(1)], [value('bogus')]])('%p should throw', (operand) => {
      const expression = not(operand)
      expect(() => expression.evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each([
      [value(false), true],
      [value(true), false],
      [reference('RefA'), false],
      [reference('Missing'), not(reference('Missing'))],
      [reference('invalid'), not(reference('invalid'))],
    ])('%p should evaluate as %p', (operand, expected) => {
      const simplified = not(operand).simplify({ RefA: true, invalid: 1 })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toBe(simplified)
      }
    })
  })
})
