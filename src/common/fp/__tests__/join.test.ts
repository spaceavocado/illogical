import { join } from '../join'

describe('common / fp / join', () => {
  it.each([
    [undefined, '1,2,3'],
    [';', '1;2;3'],
  ])('%p is expected to join items as %p', (separator, expected) => {
    expect(join(separator)(['1', '2', '3'])).toBe(expected)
  })
})
