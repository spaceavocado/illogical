import { cond, each, entries, pipe, stubTrue } from './common/fp'
import {
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from './common/type-check'
import { asExpected, hasOwnProperty } from './common/utils'

export type Expression = Evaluated
export type Context = Record<string, unknown>
export const FlattenContextKey: unique symbol = Symbol('FlattenContext')
export type FlattenContext = Context & { [FlattenContextKey]: true }

export type EvaluatedPrimitive = string | number | boolean | null
export type EvaluatedValue = undefined | EvaluatedPrimitive
export type Evaluated = EvaluatedValue | Array<Evaluated>

export interface Evaluable {
  evaluate(context?: Context): Evaluated
  simplify(context?: Context): Evaluated | Evaluable
  serialize(): Expression
  toString(): string
}

export const isEvaluable = (value: unknown): value is Evaluable =>
  typeof value === 'object' && !isNullOrUndefined(value) && 'evaluate' in value

export const isEvaluatedPrimitive = (
  value: unknown
): value is EvaluatedPrimitive =>
  isNull(value) || isString(value) || isNumber(value) || isBoolean(value)

export const isEvaluatedValue = (value: unknown): value is EvaluatedValue =>
  isUndefined(value) || isEvaluatedPrimitive(value)

export const isFlattenContext = (
  value: Context | FlattenContext | undefined
): value is FlattenContext =>
  !isUndefined(value) && hasOwnProperty(value, FlattenContextKey)

export const joinPath = (a: string, b: string): string =>
  a.length == 0 ? b : `${a}.${b}`

export const flattenContext = (
  context: Context | FlattenContext | undefined
): FlattenContext | undefined => {
  if (isUndefined(context) || isFlattenContext(context)) {
    return context
  }

  const flatten: FlattenContext = { [FlattenContextKey]: true }
  const lookup = (value: unknown, path: string): void =>
    cond<unknown, void>([
      [isArray, each((inner, index) => lookup(inner, `${path}[${index}]`))],
      [
        isObject,
        pipe(
          asExpected<Record<string, unknown>>,
          entries,
          each(([key, inner]) => lookup(inner, joinPath(path, key)))
        ),
      ],
      [stubTrue, () => (flatten[path] = value)],
    ])(value)

  lookup(context, '')
  return flatten
}
