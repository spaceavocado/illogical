import { isArray } from '../isArray'

describe('common / type check / isArray', () => {
  test.each([
    // Truthy
    [[], true],
    [[1, 'value'], true],
    // Falsy
    [null, false],
    ['value', false],
    [1, false],
    [true, false],
    [false, false],
    [undefined, false],
    [{}, false],
    [() => true, false],
    [Symbol(), false],
  ])('%p should evaluate as %p', (value, expected) => {
    expect(isArray(value)).toBe(expected)
  })
})
