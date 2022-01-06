import { not } from '../../common/fp'
import { isNullOrUndefined } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { Comparison, comparison } from './comparison'

export const KIND = Symbol('PRESENT')

export const present = (operand: Evaluable): Comparison =>
  comparison({
    operator: 'present',
    kind: KIND,
    operands: [operand],
    comparison: not(isNullOrUndefined),
    toString: () => `(${operand} is present)`,
  })
