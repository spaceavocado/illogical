import { EvaluatedValue } from '../../evaluable'
import { value } from '..'

describe('operand / value', () => {
  const testCases: EvaluatedValue[] = [1, '1', true, null, undefined]

  describe('evaluate', () => {
    it.each(testCases)('%p should evaluate as self', (operand) => {
      expect(value(operand).evaluate({})).toBe(operand)
    })
  })

  describe('simplify', () => {
    it.each(testCases)('%p should simplify to self', (operand) => {
      expect(value(operand).simplify({})).toBe(operand)
    })
  })

  describe('serialize', () => {
    it.each(testCases)('%p should serialize to self', (operand) => {
      expect(value(operand).serialize()).toBe(operand)
    })
  })

  describe('toString', () => {
    it.each([
      [1, '1'],
      ['1', '"1"'],
      [true, 'true'],
      [null, 'null'],
      [undefined, 'undefined'],
    ])('%p should be %p', (operand, expected) => {
      expect(value(operand).toString()).toBe(expected)
    })
  })
})
