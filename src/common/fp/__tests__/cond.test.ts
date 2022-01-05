import { cond } from '../cond'
import { constant } from '../constant'
import { eq } from '../eq'
import { identity } from '../identity'
import { stubTrue } from '../stubTrue'
import { Predicate } from '../types'

describe('common / fp / cond', () => {
  const pairs: [Predicate<unknown>, (value: unknown) => unknown][] = [
    [eq(1), identity],
    [stubTrue, constant(2)],
  ]
  it.each([
    [1, 1],
    [2, 2],
  ])('%p should be resolved as %p', (value, expected) => {
    expect(cond(pairs)(value)).toBe(expected)
  })
})
