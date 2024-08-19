import { Evaluable, isEvaluable } from '../../../evaluable'
import { reference, value } from '../../../operand'
import { nor } from '../nor'
import { not } from '../not'

describe('expression / logical / nor', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => nor(operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      // Truthy
      [[value(false), value(false)], true],
      [[value(false), value(false), value(false)], true],
      // Falsy
      [[value(true), value(true)], false],
      [[value(false), value(true)], false],
      [[value(true), value(false)], false],
      [[value(true), value(true)], false],
      [[value(true), value(true), value(true)], false],
    ])('%p should evaluate as %p', (operands, expected) => {
      const expression = nor(operands)
      expect(expression.evaluate({})).toBe(expected)
    })
  })

  describe('evaluate - invalid operand', () => {
    it.each([
      [[value(false), value(1)]],
      [[value(1), value(false)]],
      [[value(1), value('bogus')]],
    ])('%p should throw', (operands) => {
      const expression = nor(operands)
      expect(() => expression.evaluate({})).toThrowError()
    })
  })

  describe('simplify', () => {
    it.each([
      [[value(false), value(false)], true],
      [[value(false), value(true)], false],
      [[value(true), value(false)], false],
      [[value(true), value(true)], false],
      [[reference('RefA'), value(false)], false],
      [[reference('Missing'), value(false)], not(reference('Missing'))],
      [
        [reference('Missing'), reference('Missing')],
        nor([reference('Missing'), reference('Missing')]),
      ],
      [[value(false), reference('invalid')], not(reference('invalid'))],
    ])('%p should evaluate as %p', (operands, expected) => {
      const simplified = nor(operands).simplify({ RefA: true, invalid: 1 })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toBe(simplified)
      }
    })
  })
})
