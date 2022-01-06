import { asExpected } from '../utils'
import { Predicate } from './types'

export const cond =
  <T, S>(pairs: [Predicate<T>, (value: T) => S][]) =>
  (value: T): S => {
    for (const [predicate, result] of pairs) {
      if (predicate(value)) {
        return result(value)
      }
    }
    return asExpected(undefined)
  }
