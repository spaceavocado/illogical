import { flattenContext, isEvaluable } from '../../evaluable'
import {
  contextLookup,
  DataType,
  defaultReferenceSerializeOptions,
  evaluate,
  getDataType,
  isIgnoredPath,
  isValidDataType,
  reference,
  toBoolean,
  toDataType,
  toFloat,
  toInt,
  toNumber,
  toString,
  trimDataType,
} from '../reference'

describe('operand / reference', () => {
  const context = flattenContext({
    refA: 1,
    refB: {
      refB1: 2,
      refB2: 'refB1',
      refB3: true,
    },
    refC: 'refB1',
    refD: 'refB2',
    refE: [1, [2, 3, 4]],
    refF: 'A',
    refG: '1',
    refH: '1.1',
    refX: undefined,
  })

  describe('defaultReferenceSerializeOptions.from', () => {
    it.each([
      ['$path', 'path'],
      ['', undefined],
      ['path', undefined],
    ])('%p should be resolved as %p', (operand, expected) => {
      expect(defaultReferenceSerializeOptions.from(operand)).toBe(expected)
    })
  })

  describe('defaultReferenceSerializeOptions.to', () => {
    it.each([['path', '$path']])(
      '%p should be resolved as %p',
      (operand, expected) => {
        expect(defaultReferenceSerializeOptions.to(operand)).toBe(expected)
      }
    )
  })

  describe('isIgnoredPath', () => {
    const ignoredPaths = ['ignored', /\.ignored\./]
    it.each([
      ['ignored', true],
      ['root.ignored.property', true],
      ['expected', false],
    ])('%p should be resolved as %p', (path, expected) => {
      expect(isIgnoredPath(ignoredPaths, path)).toBe(expected)
    })
  })

  describe('isValidDataType', () => {
    it.each([
      ['Number', true],
      ['Integer', true],
      ['Float', true],
      ['String', true],
      ['Boolean', true],
      ['bogus', false],
      ['Unknown', false],
      ['Unsupported', false],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(isValidDataType(input)).toBe(expected)
    })
  })

  describe('getDataType', () => {
    it.each([
      ['ref', DataType.Unknown],
      ['ref.(X)', DataType.Unknown],
      ['ref.(Bogus)', DataType.Unsupported],
      ['ref.(String)', DataType.String],
      ['ref.(Number)', DataType.Number],
      ['ref.(Integer)', DataType.Integer],
      ['ref.(Float)', DataType.Float],
      ['ref.(Boolean)', DataType.Boolean],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(getDataType(input)).toBe(expected)
    })
  })

  describe('trimDataType', () => {
    it.each([
      ['ref', 'ref'],
      ['ref.(X)', 'ref.(X)'],
      ['ref.(String)', 'ref'],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(trimDataType(input)).toBe(expected)
    })
  })

  describe('contextLookup', () => {
    it.each([
      ['UNDEFINED', false, 'UNDEFINED', undefined],
      ['refA', true, 'refA', 1],
      ['refB.refB1', true, 'refB.refB1', 2],
      ['refB.{refC}', true, 'refB.refB1', 2],
      ['refB.{UNDEFINED}', false, 'refB.{UNDEFINED}', undefined],
      ['refB.{refB.refB2}', true, 'refB.refB1', 2],
      ['refB.{refB.{refD}}', true, 'refB.refB1', 2],
      ['refE[0]', true, 'refE[0]', 1],
      ['refE[2]', false, 'refE[2]', undefined],
      ['refE[1][0]', true, 'refE[1][0]', 2],
      ['refE[1][3]', false, 'refE[1][3]', undefined],
      ['refE[{refA}][0]', true, 'refE[1][0]', 2],
      ['refE[{refA}][{refB.refB1}]', true, 'refE[1][2]', 4],
      ['ref{refF}', true, 'refA', 1],
      ['ref{UNDEFINED}', false, 'ref{UNDEFINED}', undefined],
      ['refX', true, 'refX', undefined],
    ])(
      'should resolve %p path as [%p, %p, %p]',
      (path, expectedFound, expectedPath, expectedValue) => {
        expect(contextLookup(context, path)).toStrictEqual([
          expectedFound,
          expectedPath,
          expectedValue,
        ])
      }
    )
  })

  describe('evaluate', () => {
    it.each([
      ['refA', DataType.Integer, 1],
      ['refA', DataType.String, '1'],
      ['refG', DataType.Number, 1],
      ['refH', DataType.Float, 1.1],
      ['refB.refB3', DataType.String, 'true'],
      ['refB.refB3', DataType.Boolean, true],
      ['refB.refB3', DataType.Number, 1],
      ['refJ', DataType.Unknown, undefined],
    ])('%p, %p should be resolved as %p', (path, dataType, expected) => {
      const [, , value] = evaluate(context, path, dataType)
      expect(value).toBe(expected)
    })
  })

  describe('evaluateOperand', () => {
    it.each([
      ['refA', 1],
      ['refB.refB3', true],
      ['refE[1][2]', 4],
      ['refJ', undefined],
    ])('%p should be resolved as %p', (path, expected) => {
      expect(reference(path).evaluate(context)).toBe(expected)
    })
  })

  describe('serialize', () => {
    it.each([
      ['ref', '$ref'],
      ['ref.(Number)', '$ref.(Number)'],
    ])('%p should be resolved as %p', (path, expected) => {
      expect(reference(path).serialize()).toBe(expected)
    })
  })

  describe('simplify', () => {
    it.each([
      ['refA', 1],
      ['ignored', reference('ignored')],
      ['refB.refB1', reference('refB.refB1')],
      ['ref', reference('ref')],
    ])('%p should be resolved as %p', (path, expected) => {
      const simplified = reference(path, undefined, {
        ignoredPaths: ['ignored', /^refB/],
      }).simplify(context)

      if (isEvaluable(simplified)) {
        expect(`${simplified}`).toBe(`${expected}`)
      } else {
        expect(simplified).toBe(expected)
      }
    })
  })

  describe('stringify', () => {
    it.each([
      ['ref', '{ref}'],
      ['ref.(Number)', '{ref.(Number)}'],
    ])('%p should be resolved as %p', (path, expected) => {
      expect(`${reference(path)}`).toBe(expected)
    })
  })

  describe('toNumber', () => {
    it.each([
      [1, 1],
      [1.1, 1.1],
      ['1', 1],
      ['1.1', 1.1],
      ['1.9', 1.9],
      [true, 1],
      [false, 0],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(toNumber(input)).toBe(expected)
    })
  })

  describe('toNumberError', () => {
    it.each([['bogus'], [[]]])('%p should be resolved as %p', (input) => {
      expect(() => toNumber(input)).toThrowError(/invalid conversion from/)
    })
  })

  describe('toInt', () => {
    it.each([
      [1, 1],
      [1.1, 1],
      ['1', 1],
      ['1.1', 1],
      ['1.9', 1],
      [true, 1],
      [false, 0],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(toInt(input)).toBe(expected)
    })
  })

  describe('toIntError', () => {
    it.each([['bogus'], [[]]])('%p should be resolved as %p', (input) => {
      expect(() => toInt(input)).toThrowError(/invalid conversion from/)
    })
  })

  describe('toFloat', () => {
    it.each([
      [1, 1.0],
      [1.1, 1.1],
      [1.1, 1.1],
      ['1', 1.0],
      ['1.1', 1.1],
      ['1.9', 1.9],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(toFloat(input)).toBe(expected)
    })
  })

  describe('toFloatError', () => {
    it.each([['bogus'], [[]]])('%p should be resolved as %p', (input) => {
      expect(() => toFloat(input)).toThrowError(/invalid conversion from/)
    })
  })

  describe('toString', () => {
    it.each([
      [1, '1'],
      [1.1, '1.1'],
      ['1', '1'],
      [true, 'true'],
      [false, 'false'],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(toString(input)).toBe(expected)
    })
  })

  describe('toBoolean', () => {
    it.each([
      [true, true],
      [false, false],
      ['true', true],
      ['false', false],
      ['True', true],
      ['False', false],
      ['1', true],
      ['0', false],
      [1, true],
      [0, false],
    ])('%p should be resolved as %p', (input, expected) => {
      expect(toBoolean(input)).toBe(expected)
    })
  })

  describe('toBooleanError', () => {
    it.each([['bogus'], [1.1], [3]])('%p should be resolved as %p', (input) => {
      expect(() => toBoolean(input)).toThrowError(/invalid conversion from/)
    })
  })

  describe('toDataType', () => {
    it.each([
      ['1', DataType.Number, 1],
      ['1', DataType.Integer, 1],
      ['1.1', DataType.Float, 1.1],
      ['true', DataType.Boolean, true],
      [1, DataType.String, '1'],
      [undefined, DataType.Unknown, undefined],
    ])('%p, %p should be resolved as %p', (input, dataType, expected) => {
      expect(toDataType(dataType)(input)).toBe(expected)
    })
  })
})
