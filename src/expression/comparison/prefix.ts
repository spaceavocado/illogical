import { isString } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { comparison } from './comparison'

export const prefix = (
  left: Evaluable,
  right: Evaluable,
  symbol = 'PREFIX'
): Evaluable =>
  comparison(
    '<prefixes>',
    symbol,
    (left, right) =>
      isString(left) && isString(right) ? right.startsWith(left) : false,
    left,
    right
  )
