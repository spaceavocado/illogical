import { values } from '../values'

describe('common / fp / values', () => {
  it.each<[Record<string, unknown> | Map<string, unknown>, unknown[]]>([
    [{ a: 1 }, [1]],
    [new Map([['a', 1]]), [1]],
    [{ 1: 1, b: true }, [1, true]],
  ])('%p should be mapped as %p', (object, expected) => {
    expect(values(object)).toStrictEqual(expected)
  })
})
