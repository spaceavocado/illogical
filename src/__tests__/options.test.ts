import { asExpected } from '../common/utils/asExpected'
import { hasOwnProperty } from '../common/utils/hasOwnProperty'
import { KIND_EQ } from '../expression/comparison'
import { defaultOptions, overrideOptions } from '../options'

jest.mock('../common/utils', () => ({
  asExpected,
  hasOwnProperty: (base: Record<string, unknown>, property: string) =>
    property !== 'inheritedProperty' ? hasOwnProperty(base, property) : false,
}))

describe('options', () => {
  describe('overrideOptions', () => {
    it.each([
      [defaultOptions, {}, defaultOptions],
      [
        defaultOptions,
        {
          unexpected: true,
          operatorMapping: 'missMatchingType',
        },
        defaultOptions,
      ],
      [
        defaultOptions,
        {
          simplify: {
            unexpected: true,
          },
        },
        defaultOptions,
      ],
      [
        defaultOptions,
        {
          operatorMapping: new Map([[KIND_EQ, '==']]),
        },
        { ...defaultOptions, operatorMapping: new Map([[KIND_EQ, '==']]) },
      ],
      [{ ...defaultOptions, inheritedProperty: true }, {}, defaultOptions],
    ])(
      '%p base should be overwritten with %p as %p',
      (base, override, expected) => {
        expect(overrideOptions(base)(override)).toStrictEqual(expected)
      }
    )
  })
})
