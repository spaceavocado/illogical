import { map } from '../../common/fp'
import { Evaluable, FlattenContext, flattenContext } from '../../evaluable'

export const logical = (
  operator: string,
  symbol: string,
  evaluate: (operands: Evaluable[], context?: FlattenContext) => boolean,
  simplify: (
    operands: Evaluable[],
    context?: FlattenContext
  ) => boolean | Evaluable,
  ...operands: Evaluable[]
): Evaluable => ({
  evaluate: (context) => evaluate(operands, flattenContext(context)),
  simplify: function (context) {
    return simplify.bind(this)(operands, flattenContext(context))
  },
  serialize: () => [
    symbol,
    ...map((operand: Evaluable) => operand.serialize())(operands),
  ],
  toString: () =>
    operands.length === 1
      ? `(${operator} ${operands[0]})`
      : `(${operands
          .map((operand) => operand.toString())
          .join(` ${operator} `)})`,
})
