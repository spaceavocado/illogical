import { isArray } from '../type-check'

export const each =
  <T>(fn: (item: T, index: number) => void) =>
  (iterable: T | Array<T>): void =>
    isArray(iterable) ? iterable.forEach(fn) : fn(iterable, 0)
