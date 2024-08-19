import {
  flattenContext,
  FlattenContextKey,
  isEvaluable,
  isEvaluatedPrimitive,
  isEvaluatedValue,
  isFlattenContext,
  joinPath,
} from '../evaluable'

describe('evaluable', () => {
  describe('isEvaluable', () => {
    test.each([
      // Truthy
      [
        {
          evaluate: () => undefined,
        },
        true,
      ],
      // Falsy
      ['value', false],
      [1, false],
      [null, false],
      [undefined, false],
      [{}, false],
      [() => true, false],
      [[], false],
      [Symbol(), false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isEvaluable(value)).toBe(expected)
    })
  })

  describe('isEvaluatedPrimitive', () => {
    test.each([
      // Truthy
      [true, true],
      [false, true],
      ['value', true],
      [1, true],
      [null, true],
      // Falsy
      [undefined, false],
      [{}, false],
      [() => true, false],
      [[], false],
      [Symbol(), false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isEvaluatedPrimitive(value)).toBe(expected)
    })
  })

  describe('isEvaluatedValue', () => {
    test.each([
      // Truthy
      [true, true],
      [false, true],
      ['value', true],
      [1, true],
      [null, true],
      [undefined, true],
      // Falsy
      [{}, false],
      [() => true, false],
      [[], false],
      [Symbol(), false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isEvaluatedValue(value)).toBe(expected)
    })
  })

  describe('isFlattenContext', () => {
    test.each([
      // Truthy
      [{ [FlattenContextKey]: true }, true],
      // Falsy
      [{}, false],
      [undefined, false],
    ])('%p should evaluate as %p', (value, expected) => {
      expect(isFlattenContext(value)).toBe(expected)
    })
  })

  describe('joinPath', () => {
    test.each([
      ['', 'b', 'b'],
      ['a', 'b', 'a.b'],
    ])('%p, %p should evaluate as %p', (a, b, expected) => {
      expect(joinPath(a, b)).toBe(expected)
    })
  })

  describe('flattenContext', () => {
    test.each([
      [undefined, undefined],
      [
        { [FlattenContextKey]: true, nested: { key: 'value' } },
        { [FlattenContextKey]: true, nested: { key: 'value' } },
      ],
      [{ a: 1 }, { [FlattenContextKey]: true, a: 1 }],
      [
        { a: 1, b: { c: 5, d: true }, c: undefined },
        {
          [FlattenContextKey]: true,
          a: 1,
          'b.c': 5,
          'b.d': true,
          c: undefined,
        },
      ],
      [
        { a: 1, b: [1, 'value', true] },
        {
          [FlattenContextKey]: true,
          a: 1,
          'b[0]': 1,
          'b[1]': 'value',
          'b[2]': true,
        },
      ],
      [
        { a: 1, b: [1.1, { c: false, d: 1.2 }, 'c'] },
        {
          [FlattenContextKey]: true,
          a: 1,
          'b[0]': 1.1,
          'b[1].c': false,
          'b[1].d': 1.2,
          'b[2]': 'c',
        },
      ],
    ])('%p, %p should evaluate as %p', (context, expected) => {
      expect(flattenContext(context)).toStrictEqual(expected)
    })
  })
})
