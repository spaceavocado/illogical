import { ifElse, join, map, pipe } from '../../common/fp'
import { isUndefined } from '../../common/type-check'
import { Optional } from '../../common/types'
import { hasOwnProperty } from '../../common/utils'
import {
  Context,
  Evaluable,
  Evaluated,
  SerializeOptions,
} from '../../evaluable'

export type Logical = Omit<Evaluable, 'evaluate'> & {
  operator: string
  operands: Evaluable[]
  evaluate(context: Context): boolean
}

export const logical = (
  evaluable: Omit<Optional<Logical, 'toString'>, 'serialize'>
): Logical => ({
  ...evaluable,
  serialize: (options: SerializeOptions = {}) =>
    ifElse<string | undefined, undefined, Evaluated>(
      isUndefined,
      () => {
        throw new Error(`missing mapping for ${evaluable.operator} operator`)
      },
      (kind) => [
        kind,
        ...map((operand: Evaluable) => operand.serialize(options))(
          evaluable.operands
        ),
      ]
    )((options.operatorMapping ?? new Map()).get(evaluable.kind)),
  toString: hasOwnProperty(evaluable, 'toString')
    ? evaluable.toString
    : () =>
        `(${pipe(
          map((operand: Evaluable) => operand.toString()),
          join(` ${evaluable.operator} `)
        )(evaluable.operands)})`,
})
