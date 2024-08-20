import {
  head,
  identity,
  ifElse,
  join,
  map,
  pipe,
  slice,
  some,
} from '../common/fp'
import { isString, isUndefined } from '../common/type-check/'
import { Evaluable, Evaluated, flattenContext, isEvaluable } from '../evaluable'

export type CollectionSerializeOptions = {
  escapedOperators: Set<string>
  escapeCharacter?: string
}

export const DEFAULT_ESCAPE_CHARACTER = '\\'

export const shouldBeEscaped =
  (options?: CollectionSerializeOptions) =>
  (serialized: unknown): boolean =>
    !isUndefined(options) &&
    isString(serialized) &&
    !isUndefined(options.escapeCharacter) &&
    options.escapedOperators.has(serialized)

export const escapeOperator =
  (options?: CollectionSerializeOptions) =>
  (serialized: unknown): string =>
    !isUndefined(options)
      ? `${options.escapeCharacter}${serialized}`
      : `${serialized}`

export const collection = (
  items: Evaluable[],
  serializeOptions: CollectionSerializeOptions = {
    escapeCharacter: DEFAULT_ESCAPE_CHARACTER,
    escapedOperators: new Set<string>(),
  }
): Evaluable => {
  if (!items.length) {
    throw new Error('collection operand must have at least 1 item')
  }

  return {
    evaluate: (context) =>
      ((context) => map((item: Evaluable) => item.evaluate(context))(items))(
        flattenContext(context)
      ),
    simplify: function (context) {
      context = flattenContext(context)

      return pipe(
        map((item: Evaluable) => item.simplify(context)),
        ifElse(
          some(isEvaluable),
          () => this,
          (evaluated: Evaluated[]) => evaluated
        )
      )(items)
    },
    serialize: () => [
      ifElse<Evaluated, string, Evaluated>(
        shouldBeEscaped(serializeOptions),
        escapeOperator(serializeOptions),
        identity
      )(head(items).serialize()),
      ...pipe(
        slice(1),
        map((item: Evaluable) => item.serialize())
      )(items),
    ],
    toString: () =>
      '[' +
      pipe(
        map((item: Evaluable) => item.toString()),
        join(', ')
      )(items) +
      ']',
  }
}
