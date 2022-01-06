import { Monoid } from './types'

export const reduce =
  <T, S>(fn: (acc: S, cur: T) => S, zero?: S) =>
  (monoid: Monoid<T>): S =>
    monoid.reduce(fn, zero)
