import { slice } from '../slice'

describe('common / fp / slice', () => {
  it.each([
    [[], undefined, undefined, []],
    [[1], undefined, undefined, [1]],
    [[1, 2, 3], 1, undefined, [2, 3]],
    [[1, 2, 3], 1, 2, [2]],
  ])(
    'collection %p should be sliced, starting at %p, ending at %p as %p',
    (collection, start, end, expected) => {
      expect(slice(start, end)(collection)).toStrictEqual(expected)
    }
  )
})
