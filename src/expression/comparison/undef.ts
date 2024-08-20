import { isUndefined } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { comparison } from './comparison'

export const undef = (operand: Evaluable, symbol = 'NULL'): Evaluable =>
  comparison('<is undefined>', symbol, isUndefined, operand)
