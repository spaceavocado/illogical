import { reduce } from '../reduce'

describe('common / fp / reduce', () => {
  const fn = (acc: number, current: number) => (acc ?? 0) + current
  it.each([[[1, 2, 3], 6]])(
    '%p should be reduced as %p',
    (monoid, expected) => {
      expect(reduce(fn)(monoid)).toStrictEqual(expected)
    }
  )
})
