import { isUndefined } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('UNDEFINED')

export const undef = (operand: Evaluable): Comparison =>
  comparison({
    operator: 'undefined',
    kind: KIND,
    operands: [operand],
    comparison: isUndefined,
    toString: () => `(${operand} is undefined)`,
  })
