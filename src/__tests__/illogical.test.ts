import { isEvaluable } from '../evaluable'
import { eq } from '../expression/comparison'
import { and } from '../expression/logical'
import { illogical as createIllogical } from '../illogical'
import { collection, reference, value } from '../operand'
import { defaultReferenceSerializeOptions } from '../operand/reference'
import { DEFAULT_OPERATOR_MAPPING, Operator } from '../parser/parser'

describe('illogical', () => {
  const illogical = createIllogical()
  const mockAddress = defaultReferenceSerializeOptions.to

  describe('parse', () => {
    it.each([
      [1, value(1)],
      [mockAddress('path'), reference('path')],
      [[1], collection([value(1)])],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), 1, 1],
        eq(value(1), value(1)),
      ],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.AND), true, true],
        and([value(true), value(true)]),
      ],
    ])('%p should resolve as %p', (expression, expected) => {
      expect(`${illogical.parse(expression)}`).toBe(`${expected}`)
    })
  })

  describe('evaluate', () => {
    it.each([
      [1, 1],
      [mockAddress('path'), 'value'],
      [[1], [1]],
      [[DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), 1, 1], true],
      [[DEFAULT_OPERATOR_MAPPING.get(Operator.AND), true, false], false],
    ])('%p should resolve as %p', (expression, expected) => {
      expect(illogical.evaluate(expression, { path: 'value' })).toStrictEqual(
        expected
      )
    })
  })

  describe('simplify', () => {
    it.each([
      [1, 1],
      [mockAddress('path'), 'value'],
      [mockAddress('nested.inner'), 2],
      [mockAddress('list[1]'), 3],
      [mockAddress('missing'), reference('missing')],
      [[1], [1]],
      [[DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), 1, 1], true],
      [[DEFAULT_OPERATOR_MAPPING.get(Operator.AND), true, true], true],
      [
        [
          DEFAULT_OPERATOR_MAPPING.get(Operator.AND),
          true,
          mockAddress('missing'),
        ],
        reference('missing'),
      ],
    ])('%p should resolve as %p', (expression, expected) => {
      const simplified = illogical.simplify(expression, {
        path: 'value',
        nested: { inner: 2 },
        list: [1, 3],
      })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toStrictEqual(simplified)
      }
    })
  })

  describe('statement', () => {
    it.each([
      [1, '1'],
      [true, 'true'],
      ['value', '"value"'],
      [mockAddress('refA'), '{refA}'],
      [[1], '[1]'],
      [
        [DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), mockAddress('refA'), 1],
        '({refA} == 1)',
      ],
      [
        [
          DEFAULT_OPERATOR_MAPPING.get(Operator.AND),
          [DEFAULT_OPERATOR_MAPPING.get(Operator.EQ), 1, 1],
          [DEFAULT_OPERATOR_MAPPING.get(Operator.NE), 2, 1],
        ],
        '((1 == 1) AND (2 != 1))',
      ],
    ])('%p should resolve as %p', (expression, expected) => {
      expect(`${illogical.statement(expression)}`).toBe(`${expected}`)
    })
  })

  describe('operator mapping', () => {
    it.each([
      [['IS', 1, 1], true],
      [['IS', 1, 2], false],
    ])('%p should resolve as %p', (expression, expected) => {
      const operatorMapping = new Map<Operator, string>(
        DEFAULT_OPERATOR_MAPPING
      )
      operatorMapping.set(Operator.EQ, 'IS')

      const illogical = createIllogical({ operatorMapping })
      expect(illogical.evaluate(expression)).toBe(expected)
    })
  })

  describe('serialize options', () => {
    it.each([
      ['__ref', reference('ref')],
      ['$ref', value('$ref')],
    ])('%p should resolve as %p', (expression, expected) => {
      const serializeOptions = {
        from: (operand: string) =>
          operand.length > 2 && operand.startsWith('__')
            ? operand.slice(2)
            : undefined,
        to: (operand: string) => `__${operand}`,
      }

      const illogical = createIllogical({ serializeOptions })
      const parsed = illogical.parse(expression)
      const serialized = parsed.serialize()

      expect(`${parsed}`).toBe(`${expected}`)
      expect(serialized).toBe(expression)
    })
  })

  describe('simplify options', () => {
    it.each([
      [mockAddress('refA'), 1],
      [mockAddress('refB'), reference('refB')],
      [mockAddress('ignored'), reference('ignored')],
    ])('%p should resolve as %p', (expression, expected) => {
      const illogical = createIllogical({
        simplifyOptions: {
          ignoredPaths: ['ignored', /^refB/],
        },
      })
      const simplified = illogical.simplify(expression, {
        refA: 1,
        refB: 2,
        ignored: 3,
      })

      if (isEvaluable(simplified)) {
        expect(`${expected}`).toBe(`${simplified}`)
      } else {
        expect(expected).toStrictEqual(simplified)
      }
    })
  })

  describe('escape character', () => {
    it.each([[['*AND', 1, 1], collection([value('AND'), value(1), value(1)])]])(
      '%p should resolve as %p',
      (expression, expected) => {
        const illogical = createIllogical({ escapeCharacter: '*' })

        expect(`${illogical.parse(expression)}`).toBe(`${expected}`)
      }
    )
  })
})
