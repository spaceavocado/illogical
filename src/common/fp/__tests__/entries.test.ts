import { entries } from '../entries'

describe('common / fp / entries', () => {
  it.each<[Record<string | number, unknown>, [unknown, unknown][]]>([
    [{ a: 1 }, [['a', 1]]],
    [
      { 1: 1, b: 2 },
      [
        ['1', 1],
        ['b', 2],
      ],
    ],
  ])('%p should be mapped as %p', (object, expected) => {
    expect(entries(object)).toStrictEqual(expected)
  })
})
