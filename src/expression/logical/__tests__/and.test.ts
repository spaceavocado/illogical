import { Evaluable, isEvaluable } from '../../../evaluable'
import { reference, value } from '../../../operand'
import { and } from '../and'

describe('expression / logical / and', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => and(operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      // Truthy
      [[value(true), value(true)], true],
      [[value(true), value(true), value(true)], true],
      // Falsy
      [[value(true), value(false)], false],
      [[value(false), value(true)], false],
      [[value(false), value(false)], false],
    ])('%p should evaluate as %p', (operands, expected) => {
      const expression = and(operands)
      expect(expression.evaluate({})).toBe(expected)
    })
  })

  describe('evaluate - invalid operand', () => {
    it.each([
      [[value(true), value(1)]],
      [[value(1), value(true)]],
      [[value(1), value('bogus')]],
    ])('%p should throw', (operands) => {
      const expression = and(operands)
      expect(() => expression.evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each([
      [[value(true), value(true)], true],
      [[value(false), value(true)], false],
      [[reference('RefA'), value(true)], true],
      [[reference('Missing'), value(true)], reference('Missing')],
      [
        [reference('Missing'), reference('Missing')],
        and([reference('Missing'), reference('Missing')]),
      ],
      [[value(true), reference('invalid')], reference('invalid')],
    ])('%p should evaluate as %p', (operands, expected) => {
      const simplified = and(operands).simplify({ RefA: true, invalid: 1 })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toBe(simplified)
      }
    })
  })
})
