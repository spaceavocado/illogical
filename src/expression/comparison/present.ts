import { not } from '../../common/fp'
import { isNullOrUndefined } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { comparison } from './comparison'

export const present = (operand: Evaluable, symbol = 'PRESENT'): Evaluable =>
  comparison('<is present>', symbol, not(isNullOrUndefined), operand)
