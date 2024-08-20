import { Evaluable } from '../../../evaluable'
import { value } from '../../../operand'
import { logical } from '../logical'

describe('expression / logical', () => {
  const logicalMock = (operator: string, ...operators: Evaluable[]) =>
    logical(
      `${operator}[op]`,
      operator,
      () => true,
      () => true,
      ...operators
    )

  describe('serialize', () => {
    it.each([
      ['->', [value(1), value(2)], ['->', 1, 2]],
      ['X', [value(1)], ['X', 1]],
    ])('%p, %p should be %p', (operator, operators, expected) => {
      expect(logicalMock(operator, ...operators).serialize()).toStrictEqual(
        expected
      )
    })
  })

  describe('stringify', () => {
    it.each([
      ['->', [value(1), value(2)], '(1 ->[op] 2)'],
      ['NOT', [value(1)], '(NOT[op] 1)'],
    ])('%p, %p should be %p', (operator, operators, expected) => {
      expect(`${logicalMock(operator, ...operators)}`).toBe(expected)
    })
  })
})
