import { fromEntries } from '../fromEntries'

describe('common / fp / fromEntries', () => {
  it.each<[[string, unknown][], Record<string | number, unknown>]>([
    [[['a', 1]], { a: 1 }],
    [
      [
        ['1', 1],
        ['b', 2],
      ],
      { 1: 1, b: 2 },
    ],
  ])('%p should be mapped as %p', (entries, expected) => {
    expect(fromEntries(entries)).toStrictEqual(expected)
  })
})
