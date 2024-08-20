import { isBoolean } from '../../common/type-check'
import { Evaluable, isEvaluable } from '../../evaluable'
import { logical } from './logical'

export const or = (operands: Evaluable[], symbol = 'OR'): Evaluable => {
  if (operands.length < 2) {
    throw new Error(
      'Non unary logical expression must have at least 2 operands'
    )
  }

  return logical(
    'OR',
    symbol,
    (operands, context) => {
      for (const operand of operands) {
        const result = operand.evaluate(context)
        if (!isBoolean(result)) {
          throw new Error(
            `invalid evaluated operand "${result}" (${operand}) in NOR expression, must be boolean value`
          )
        } else if (result) {
          return true
        }
      }
      return false
    },
    (operands, context) => {
      const simplified: Evaluable[] = []

      for (const operand of operands) {
        const result = operand.simplify(context)
        if (isBoolean(result)) {
          if (result) {
            return true
          }
          continue
        }

        simplified.push(isEvaluable(simplified) ? simplified : operand)
      }

      if (simplified.length === 0) {
        return false
      }

      if (simplified.length === 1) {
        return simplified[0]
      }

      return or(simplified, symbol)
    },
    ...operands
  )
}
