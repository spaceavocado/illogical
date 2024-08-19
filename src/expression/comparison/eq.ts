import { Evaluable } from '../../evaluable'
import { comparison } from './comparison'

export const eq = (
  left: Evaluable,
  right: Evaluable,
  symbol = '=='
): Evaluable =>
  comparison('==', symbol, (left, right) => left === right, left, right)
