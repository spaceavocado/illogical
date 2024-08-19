import { isString } from '../common/type-check/'
import { Evaluable, EvaluatedValue } from '../evaluable'

export const value = (value: EvaluatedValue): Evaluable => ({
  evaluate: () => value,
  simplify: () => value,
  serialize: () => value,
  toString: () => (isString(value) ? `"${value}"` : `${value}`),
})
