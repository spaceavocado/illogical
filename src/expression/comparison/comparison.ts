import { ifElse, map, not, pipe, some } from '../../common/fp'
import {
  Evaluable,
  Evaluated,
  flattenContext,
  isEvaluable,
} from '../../evaluable'

export const comparison = (
  operator: string,
  symbol: string,
  compare: (...results: Evaluated[]) => boolean,
  ...operands: Evaluable[]
): Evaluable => ({
  evaluate: (context) =>
    ((context) =>
      compare(
        ...map((operand: Evaluable) => operand.evaluate(context))(operands)
      ))(flattenContext(context)),
  serialize: () => [
    symbol,
    ...map((operand: Evaluable) => operand.serialize())(operands),
  ],
  simplify: function (context) {
    context = flattenContext(context)

    return pipe(
      map((operand: Evaluable) => operand.simplify(context)),
      ifElse(
        not(some(isEvaluable)),
        (simplified: Evaluated[]) => compare(...simplified),
        () => this
      )
    )(operands)
  },
  toString: () => {
    let result = `(${operands[0]} ${operator}`
    if (operands.length > 1) {
      result += ` ${operands.slice(1).join(' ')}`
    }
    return `${result})`
  },
})
