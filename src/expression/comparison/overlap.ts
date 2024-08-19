import { isArray } from '../../common/type-check'
import { asExpected } from '../../common/utils'
import { Evaluable, EvaluatedPrimitive } from '../../evaluable'
import { comparison } from './comparison'

export const overlap = (
  left: Evaluable,
  right: Evaluable,
  symbol = 'OVERLAP'
): Evaluable => {
  return comparison(
    '<overlaps>',
    symbol,
    (left, right) => {
      const a = asExpected<EvaluatedPrimitive[]>(isArray(left) ? left : [left])
      const b = asExpected<EvaluatedPrimitive[]>(
        isArray(right) ? right : [right]
      )

      return a.some((value) => b.includes(value))
    },
    left,
    right
  )
}
