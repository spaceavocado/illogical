import { Evaluable, isEvaluable } from '../../../evaluable'
import { reference, value } from '../../../operand'
import { nor } from '../nor'
import { not } from '../not'
import { xor } from '../xor'

describe('expression / logical / xor', () => {
  describe('constructor', () => {
    it.each<[Evaluable[]]>([[[]], [[value(1)]]])(
      '%p should throw',
      (operands) => {
        expect(() => xor(operands)).toThrowError()
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      // Truthy
      [[value(true), value(false)], true],
      [[value(false), value(true)], true],
      [[value(false), value(false), value(true)], true],
      [[value(false), value(true), value(false)], true],
      [[value(true), value(false), value(false)], true],
      // Falsy
      [[value(false), value(false)], false],
      [[value(true), value(true)], false],
      [[value(true), value(true), value(false)], false],
      [[value(true), value(false), value(true)], false],
      [[value(false), value(true), value(true)], false],
    ])('%p should evaluate as %p', (operands, expected) => {
      const expression = xor(operands)
      expect(expression.evaluate({})).toBe(expected)
    })
  })

  describe('evaluate - invalid operand', () => {
    it.each([[[value(1), value(true)]], [[value(1), value('bogus')]]])(
      '%p should throw',
      (operands) => {
        const expression = xor(operands)
        expect(() => expression.evaluate({})).toThrowError()
      }
    )
  })

  describe('simplify', () => {
    it.each([
      [[value(true), value(false)], true],
      [[value(false), value(true)], true],
      [[value(false), value(false)], false],
      [[value(true), value(true)], false],
      [[value(true), value(true), value(1)], false],
      [[reference('RefA'), value(false)], true],
      [[reference('Missing'), value(false)], reference('Missing')],
      [[reference('Missing'), value(true)], not(reference('Missing'))],
      [
        [reference('Missing'), reference('Missing'), value(true)],
        nor([reference('Missing'), reference('Missing')]),
      ],
      [
        [reference('Missing'), reference('Missing')],
        xor([reference('Missing'), reference('Missing')]),
      ],
      [[value(false), reference('invalid')], reference('invalid')],
    ])('%p should evaluate as %p', (operands, expected) => {
      const simplified = xor(operands).simplify({ RefA: true, invalid: 1 })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toBe(simplified)
      }
    })
  })
})
