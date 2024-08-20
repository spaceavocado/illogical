import { isString } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { comparison } from './comparison'

export const suffix = (
  left: Evaluable,
  right: Evaluable,
  symbol = 'SUFFIX'
): Evaluable =>
  comparison(
    '<with suffix>',
    symbol,
    (left, right) =>
      isString(left) && isString(right) ? left.endsWith(right) : false,
    left,
    right
  )
