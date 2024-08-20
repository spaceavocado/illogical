import { isArray } from '../../common/type-check'
import { asExpected } from '../../common/utils'
import { Evaluable, EvaluatedPrimitive } from '../../evaluable'
import { comparison } from './comparison'

export const notIn = (
  left: Evaluable,
  right: Evaluable,
  symbol = 'NOT IN'
): Evaluable => {
  return comparison(
    '<not in>',
    symbol,
    (left, right) => {
      const leftIsArray = isArray(left)
      const rightIsArray = isArray(right)

      if ((leftIsArray && rightIsArray) || (!leftIsArray && !rightIsArray)) {
        return true
      }

      return (
        asExpected<EvaluatedPrimitive[]>(leftIsArray ? left : right).indexOf(
          asExpected<EvaluatedPrimitive>(leftIsArray ? right : left)
        ) === -1
      )
    },
    left,
    right
  )
}
