import { each } from '../each'

describe('common / fp / each', () => {
  const fn = jest.fn()
  it.each([
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
    ['value', ['value']],
  ])('%p should be called with %p', (array, expected) => {
    each(fn)(array)

    expect(fn.mock.calls.length).toBe(expected.length)
    fn.mock.calls.forEach((call, i) => {
      expect(call[0]).toBe(expected[i])
      expect(call[1]).toBe(i)
    })
    fn.mockReset()
  })
})
