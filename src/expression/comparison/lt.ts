import { isNumber } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { comparison } from './comparison'

export const lt = (
  left: Evaluable,
  right: Evaluable,
  symbol = '<'
): Evaluable =>
  comparison(
    '<',
    symbol,
    (left, right) => (isNumber(left) && isNumber(right) ? left < right : false),
    left,
    right
  )
