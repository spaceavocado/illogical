import { isBoolean } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import { logical } from './logical'

export const not = (operand: Evaluable, symbol = 'NOT'): Evaluable => {
  return logical(
    'NOT',
    symbol,
    (operands, context) => {
      const result = operands[0].evaluate(context)
      if (!isBoolean(result)) {
        throw new Error(
          `invalid evaluated operand "${result}" (${operand}) in NOT expression, must be boolean value`
        )
      }

      return !result
    },
    function (this: Evaluable, operands, context) {
      const result = operands[0].simplify(context)
      if (isBoolean(result)) {
        return !result
      }
      return this
    },
    operand
  )
}
