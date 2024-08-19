import { Evaluable, isEvaluable } from '../../../evaluable'
import { reference, value } from '../../../operand'
import { or } from '../or'

describe('expression / logical / or', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => or(operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      // Truthy
      [[value(true), value(true)], true],
      [[value(false), value(true)], true],
      [[value(true), value(true), value(false)], true],
      [[value(true), value(1)], true],
      // Falsy
      [[value(false), value(false)], false],
    ])('%p should evaluate as %p', (operands, expected) => {
      const expression = or(operands)
      expect(expression.evaluate({})).toBe(expected)
    })
  })

  describe('evaluate - invalid operand', () => {
    it.each([
      [[value(false), value(1)]],
      [[value(1), value(false)]],
      [[value(1), value('bogus')]],
    ])('%p should throw', (operands) => {
      const expression = or(operands)
      expect(() => expression.evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each([
      [[value(true), value(true)], true],
      [[value(true), value(true)], true],
      [[value(false), value(true)], true],
      [[value(true), value(1)], true],
      [[reference('RefA'), value(false)], true],
      [[reference('Missing'), value(false)], reference('Missing')],
      [
        [reference('Missing'), reference('Missing')],
        or([reference('Missing'), reference('Missing')]),
      ],
      [
        [value(false), reference('invalid'), value(false)],
        reference('invalid'),
      ],
    ])('%p should evaluate as %p', (operands, expected) => {
      const simplified = or(operands).simplify({ RefA: true, invalid: 1 })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toBe(simplified)
      }
    })
  })
})
