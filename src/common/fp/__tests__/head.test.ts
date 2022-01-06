import { head } from '../head'

describe('common / fp / head', () => {
  it.each([
    [[], undefined],
    [[1, 2, 3], 1],
  ])('%p is expected to get head as %p', (collection, expected) => {
    expect(head(collection)).toBe(expected)
  })
})
