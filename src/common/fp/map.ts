import { Functor } from './types'

export const map =
  <T, U>(fn: (item: T) => U) =>
  (functor: Functor<T>): U[] =>
    functor.map(fn)
