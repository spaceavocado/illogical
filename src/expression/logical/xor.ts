import { isBoolean, isUndefined } from '../../common/type-check'
import { Evaluable, isEvaluable } from '../../evaluable'
import { logical } from './logical'
import { nor } from './nor'
import { not } from './not'

export const xor = (
  operands: Evaluable[],
  symbol = 'XOR',
  notSymbol = 'NOT',
  norSymbol = 'NOR'
): Evaluable => {
  if (operands.length < 2) {
    throw new Error(
      'Non unary logical expression must have at least 2 operands'
    )
  }

  return logical(
    'XOR',
    symbol,
    (operands, context) => {
      let xor: boolean | undefined = undefined

      for (const operand of operands) {
        const result = operand.evaluate(context)
        if (!isBoolean(result)) {
          throw new Error(
            `invalid evaluated operand "${result}" (${operand}) in XOR expression, must be boolean value`
          )
        }

        if (isUndefined(xor)) {
          xor = result
          continue
        }

        if (xor && result) {
          return false
        }

        xor = result ? true : xor
      }
      return xor ?? false
    },
    (operands, context) => {
      let truthy = 0
      const simplified: Evaluable[] = []

      for (const operand of operands) {
        const result = operand.simplify(context)
        if (isBoolean(result)) {
          if (result) {
            truthy++
          }
          if (truthy > 1) {
            return false
          }
          continue
        }

        simplified.push(isEvaluable(simplified) ? simplified : operand)
      }

      if (simplified.length === 0) {
        return truthy === 1
      }

      if (simplified.length === 1) {
        if (truthy === 1) {
          return not(simplified[0], notSymbol)
        }
        return simplified[0]
      }

      if (truthy === 1) {
        return nor(simplified, norSymbol, notSymbol)
      }

      return xor(simplified, symbol, notSymbol, norSymbol)
    },
    ...operands
  )
}
