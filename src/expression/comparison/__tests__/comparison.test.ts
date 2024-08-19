import { Evaluable, isEvaluable } from '../../../evaluable'
import { reference, value } from '../../../operand'
import { comparison } from '../comparison'

describe('expression / comparison', () => {
  const comparisonMock = (operator: string, ...operators: Evaluable[]) =>
    comparison(
      `${operator}[op]`,
      operator,
      (left, right) => left === right,
      ...operators
    )

  describe('evaluate', () => {
    it.each([
      [value(1), value(1), true],
      [value(1), value('1'), false],
    ])('%p, %p should be %p', (left, right, expected) => {
      expect(comparisonMock('==', left, right).evaluate()).toBe(expected)
    })
  })

  describe('serialize', () => {
    it.each([
      ['->', [value(1), value(2)], ['->', 1, 2]],
      ['X', [value(1)], ['X', 1]],
    ])('%p, %p should be %p', (operator, operators, expected) => {
      expect(comparisonMock(operator, ...operators).serialize()).toStrictEqual(
        expected
      )
    })
  })

  describe('simplify', () => {
    it.each([
      [
        value(0),
        reference('missing'),
        comparisonMock('==', value(0), reference('missing')),
      ],
      [
        reference('missing'),
        value(0),
        comparisonMock('==', reference('missing'), value(0)),
      ],
      [
        reference('missing'),
        reference('missing'),
        comparisonMock('==', reference('missing'), reference('missing')),
      ],
      [value(0), value(0), true],
      [value(0), value(1), false],
      [value('A'), reference('refA'), true],
    ])('%p, %p should be %p', (left, right, expected) => {
      const simplified = comparisonMock('==', left, right).simplify({
        refA: 'A',
      })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toBe(simplified)
      }
    })
  })

  describe('stringify', () => {
    it.each([
      ['==', [value(1), value(2)], '(1 ==[op] 2)'],
      ['<null>', [value(1)], '(1 <null>[op])'],
    ])('%p, %p should be %p', (operator, operators, expected) => {
      expect(`${comparisonMock(operator, ...operators)}`).toStrictEqual(
        expected
      )
    })
  })
})
