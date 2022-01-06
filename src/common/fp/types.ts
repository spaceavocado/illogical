export type Predicate<T> = (value: T) => boolean

export interface Functor<T> {
  map<U>(fn: (value: T) => U): U[]
}

export interface Monoid<T> {
  reduce<S>(fn: (acc: S, cur: T) => S, zero?: S): S
}
