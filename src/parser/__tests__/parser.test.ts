import { values } from '../../common/fp'
import { isArray, isString } from '../../common/type-check'
import { Evaluable } from '../../evaluable'
import {
  eq,
  ge,
  gt,
  In,
  le,
  lt,
  ne,
  notIn,
  overlap,
  prefix,
  present,
  suffix,
  undef,
} from '../../expression/comparison'
import { and, nor, not, or, xor } from '../../expression/logical'
import {
  collection,
  DEFAULT_ESCAPE_CHARACTER,
  reference,
  value,
} from '../../operand'
import { defaultReferenceSerializeOptions } from '../../operand/reference'
import {
  binaryExpression,
  createExpression,
  createOperand,
  DEFAULT_OPERATOR_MAPPING,
  isEscaped,
  multiaryExpression,
  Operator,
  options as createOptions,
  parse,
  parser as createParser,
  toReferenceAddress,
  unaryExpression,
  UnexpectedExpressionError,
  UnexpectedExpressionInputError,
  UnexpectedOperandError,
} from '../parser'

describe('parser', () => {
  const options = createOptions()()
  const mockAddress = options.serializeOptions.to

  describe('isEscaped', () => {
    it.each([
      ['\\expected', DEFAULT_ESCAPE_CHARACTER, true],
      ['*expected', '*', true],
      ['unexpected', DEFAULT_ESCAPE_CHARACTER, false],
    ])('%p, %p should resolve as %p', (input, escapeCharacter, expected) => {
      expect(isEscaped(input, escapeCharacter)).toBe(expected)
    })
  })

  describe('toReferenceAddress', () => {
    const serializeOptions = {
      from: (operand: string) =>
        operand.length > 2 && operand.startsWith('__')
          ? operand.slice(2)
          : undefined,
      to: (operand: string) => `__${operand}`,
    }

    it.each([
      ['$expected', defaultReferenceSerializeOptions, 'expected'],
      ['__expected', serializeOptions, 'expected'],
      ['unexpected', defaultReferenceSerializeOptions, undefined],
      [undefined, defaultReferenceSerializeOptions, undefined],
    ])('%p, %p should resolve as %p', (input, options, expected) => {
      expect(toReferenceAddress(input, options)).toBe(expected)
    })
  })

  describe('parse value', () => {
    it.each([
      // value
      [1, value(1)],
      [1.1, value(1.1)],
      ['val', value('val')],
      [true, value(true)],
      [null, value(null)],
      // reference
      [mockAddress('address'), reference('address')],
      // collection
      [[1], collection([value(1)])],
      [[mockAddress('address')], collection([reference('address')])],
      [[1, 'value', true], collection([value(1), value('value'), value(true)])],
      [
        [
          `${options.escapeCharacter}${DEFAULT_OPERATOR_MAPPING.get(
            Operator.AND
          )}`,
          1,
          1,
        ],
        collection([
          value(
            `${options.escapeCharacter}${DEFAULT_OPERATOR_MAPPING.get(
              Operator.AND
            )}`
          ),
          value(1),
          value(1),
        ]),
      ],
    ])('%p, %p should resolve as %p', (input, expected) => {
      expect(`${createOperand(options)(input)}`).toBe(`${expected}`)

      if (!(isArray(input) && isEscaped(input[0], options.escapeCharacter))) {
        expect(`${parse(options)(input)}`).toBe(`${expected}`)
      }
    })
  })

  describe('parse comparison expression', () => {
    it.each([
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), 1, 1],
        eq(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.NE), 1, 1],
        ne(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.GT), 1, 1],
        gt(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.GE), 1, 1],
        ge(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.LT), 1, 1],
        lt(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.LE), 1, 1],
        le(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.IN), 1, 1],
        In(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.NOTIN), 1, 1],
        notIn(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.OVERLAP), 1, [1]],
        overlap(value(1), collection([value(1)])),
      ],
      [[DEFAULT_OPERATOR_MAPPING.get(Operator.NONE), 1, 1], undef(value(1))],
      [[DEFAULT_OPERATOR_MAPPING.get(Operator.PRESENT), 1], present(value(1))],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.PREFIX), 'pre', 'fix'],
        prefix(value('pre'), value('fix')),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.SUFFIX), 'suf', 'fix'],
        suffix(value('suf'), value('fix')),
      ],
    ])('%p, %p should resolve as %p', (input, expected) => {
      expect(`${createExpression(options)(input)}`).toBe(`${expected}`)
      expect(`${parse(options)(input)}`).toBe(`${expected}`)
    })
  })

  describe('parse logical expression', () => {
    it.each([
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.AND), true, true],
        and([value(true), value(true)]),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.OR), true, true, false],
        or([value(true), value(true), value(false)]),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.NOR), true, true],
        nor([value(true), value(true)]),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.XOR), true, true],
        xor([value(true), value(true)]),
      ],
      [[DEFAULT_OPERATOR_MAPPING.get(Operator.NOT), true], not(value(true))],
    ])('%p, %p should resolve as %p', (input, expected) => {
      expect(`${createExpression(options)(input)}`).toBe(`${expected}`)
      expect(`${parse(options)(input)}`).toBe(`${expected}`)
    })
  })

  describe('parse', () => {
    it.each([
      [1, value(1)],
      [[mockAddress('address')], collection([reference('address')])],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), 1, 1],
        eq(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.AND), true, true],
        and([value(true), value(true)]),
      ],
      [
        [
          DEFAULT_OPERATOR_MAPPING.get(Operator.AND),
          [DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), 1, 1],
          [mockAddress('address')],
        ],
        and([eq(value(1), value(1)), collection([reference('address')])]),
      ],
    ])('%p, %p should resolve as %p', (input, expected) => {
      expect(`${parse(options)(input)}`).toBe(`${expected}`)
      expect(`${createParser().parse(input)}`).toBe(`${expected}`)
    })
  })

  describe('parser with options', () => {
    const serializeOptions = {
      from: (operand: unknown) =>
        isString(operand) && operand.startsWith('__')
          ? operand.substring(2)
          : undefined,
      to: (operand: string) => `__${operand}`,
    }
    const parser = createParser(
      new Map<Operator, string>([[Operator.EQ, 'EQ']]),
      serializeOptions,
      {
        ignoredPaths: ['ignored'],
      },
      '*'
    )

    expect(`${parser.parse('__ref')}`).toBe('{ref}')
    expect(parser.parse('__ref').simplify({ ref: 1 })).toBe(1)
    expect(`${parser.parse('__ignored').simplify({ ignored: 1 })}`).toBe(
      '{ignored}'
    )
    expect(parser.parse('__ref').serialize()).toBe('__ref')
    expect(`${parser.parse(['EQ', 1, 1])}`).toStrictEqual('(1 == 1)')
    expect(`${parser.parse(['*EQ', 1, 1])}`).toBe('["EQ", 1, 1]')
  })

  describe('options', () => {
    it('default options', () => {
      const options = createOptions()()

      expect(options.serializeOptions.from('$ref')).toBe('ref')
      expect(options.serializeOptions.to('ref')).toBe('$ref')
      expect(options.simplifyOptions).toBeUndefined()
      expect(options.escapeCharacter).toBe(DEFAULT_ESCAPE_CHARACTER)
      expect(Array.from(options.escapedOperators).sort()).toStrictEqual(
        values(DEFAULT_OPERATOR_MAPPING).sort()
      )

      const operatorHandlers: [Operator, Evaluable][] = [
        [Operator.EQ, eq(value(1), value(1))],
        [Operator.NE, ne(value(1), value(1))],
        [Operator.GT, gt(value(1), value(1))],
        [Operator.GE, ge(value(1), value(1))],
        [Operator.LT, lt(value(1), value(1))],
        [Operator.LE, le(value(1), value(1))],
        [Operator.NONE, undef(value(1))],
        [Operator.PRESENT, present(value(1))],
        [Operator.IN, In(value(1), value(1))],
        [Operator.NOTIN, notIn(value(1), value(1))],
        [Operator.OVERLAP, overlap(value(1), value(1))],
        [Operator.PREFIX, prefix(value(1), value(1))],
        [Operator.SUFFIX, suffix(value(1), value(1))],
        [Operator.AND, and([value(1), value(1)])],
        [Operator.OR, or([value(1), value(1)])],
        [Operator.NOR, nor([value(1), value(1)])],
        [Operator.XOR, xor([value(1), value(1)])],
        [Operator.NOT, not(value(1))],
      ]

      for (const [operator, expected] of operatorHandlers) {
        const evaluable = options.operatorHandlerMapping[
          DEFAULT_OPERATOR_MAPPING.get(operator) ?? '=='
        ]([value(1), value(1)])

        expect(`${evaluable}`).toBe(`${expected}`)
      }
    })

    it('operatorMapping', () => {
      const options = createOptions()(
        new Map<Operator, string>([[Operator.EQ, 'EQ']])
      )

      expect(Array.from(options.escapedOperators).length).toBe(
        values(DEFAULT_OPERATOR_MAPPING).length
      )

      const operatorHandlers: [string, Evaluable][] = [
        ['EQ', eq(value(1), value(1))],
        ['!=', ne(value(1), value(1))],
      ]

      for (const [operator, expected] of operatorHandlers) {
        const evaluable = options.operatorHandlerMapping[operator]([
          value(1),
          value(1),
        ])

        expect(`${evaluable}`).toBe(`${expected}`)
      }
    })

    it('serializeOptions', () => {
      const options = createOptions()(undefined, {
        from: (operand: string) => operand.substring(2),
        to: (operand: string) => `__${operand}`,
      })

      expect(options.serializeOptions.from('__ref')).toBe('ref')
      expect(options.serializeOptions.to('ref')).toBe('__ref')
    })

    it('simplifyOptions', () => {
      const options = createOptions()(undefined, undefined, {
        ignoredPaths: ['ignored'],
      })

      expect(options.simplifyOptions?.ignoredPaths).toStrictEqual(['ignored'])
    })

    it('escapeCharacter', () => {
      const options = createOptions()(undefined, undefined, undefined, '*')

      expect(options.escapeCharacter).toBe('*')
    })
  })

  describe('unaryExpression', () => {
    const fn = jest.fn()
    const operands = [value(1), value(1)]

    unaryExpression(fn)(operands)
    expect(fn).toHaveBeenCalledWith(operands[0])
  })

  describe('binaryExpression', () => {
    const fn = jest.fn()
    const operands = [value(1), value(1)]

    binaryExpression(fn)(operands)
    expect(fn).toHaveBeenCalledWith(operands[0], operands[1])
  })

  describe('multiaryExpression', () => {
    const fn = jest.fn()
    const operands = [value(1), value(1)]

    multiaryExpression(fn)(operands)
    expect(fn).toHaveBeenCalledWith(operands)
  })

  describe('parse UnexpectedExpressionInputError', () => {
    it.each([[undefined]])('%p, %p should throw', (input) => {
      expect(() => parse(options)(input)).toThrowError(
        UnexpectedExpressionInputError
      )
    })
  })

  describe('parse UnexpectedOperandError', () => {
    it.each([[[]]])('%p, %p should throw', (input) => {
      expect(() => parse(options)(input)).toThrowError(UnexpectedOperandError)
    })
  })

  describe('parse UnexpectedExpressionError', () => {
    it.each([[['X', 1, 1]], [[1, 1, 1]]])('%p, %p should throw', (input) => {
      expect(() => createExpression(options)(input)).toThrowError(
        UnexpectedExpressionError
      )
    })
  })
})
