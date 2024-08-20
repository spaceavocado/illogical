import { values } from '../values'

describe('common / fp / values', () => {
  it.each<[Record<string | number, unknown>, unknown[]]>([
    [{ a: 1 }, [1]],
    [{ 1: 1, b: true }, [1, true]],
  ])('%p should be mapped as %p', (object, expected) => {
    expect(values(object)).toStrictEqual(expected)
  })
})
