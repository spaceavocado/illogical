import { isBoolean } from '../../common/type-check'
import { Evaluable, isEvaluable } from '../../evaluable'
import { logical } from './logical'

export const and = (operands: Evaluable[], symbol = 'AND'): Evaluable => {
  if (operands.length < 2) {
    throw new Error(
      'Non unary logical expression must have at least 2 operands'
    )
  }

  return logical(
    'AND',
    symbol,
    (operands, context) => {
      for (const operand of operands) {
        const result = operand.evaluate(context)
        if (!isBoolean(result)) {
          throw new Error(
            `invalid evaluated operand "${result}" (${operand}) in AND expression, must be boolean value`
          )
        } else if (!result) {
          return false
        }
      }
      return true
    },
    (operands, context) => {
      const simplified: Evaluable[] = []

      for (const operand of operands) {
        const result = operand.simplify(context)
        if (isBoolean(result)) {
          if (!result) {
            return false
          }
          continue
        }

        simplified.push(isEvaluable(simplified) ? simplified : operand)
      }

      if (simplified.length === 0) {
        return true
      }

      if (simplified.length === 1) {
        return simplified[0]
      }

      return and(simplified, symbol)
    },
    ...operands
  )
}
