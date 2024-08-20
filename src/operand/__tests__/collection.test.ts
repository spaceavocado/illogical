import { Evaluable } from '../../evaluable'
import { eq } from '../../expression/comparison'
import { collection } from '../collection'
import {
  DEFAULT_ESCAPE_CHARACTER,
  escapeOperator,
  shouldBeEscaped,
} from '../collection'
import { reference } from '../reference'
import { value } from '../value'

describe('operand / collection', () => {
  describe('constructor', () => {
    it.each([[[]]])('%p should throw', (items) => {
      expect(() => collection(items)).toThrowError()
    })
  })

  describe('evaluate', () => {
    it.each([
      [collection([value(1)]), [1]],
      [collection([value('1')]), ['1']],
      [collection([value(true)]), [true]],
      [collection([reference('RefA')]), ['A']],
      [collection([value(1), reference('RefA')]), [1, 'A']],
      [collection([eq(value(1), value(1)), reference('RefA')]), [true, 'A']],
    ])('%p should evaluate as %p', (evaluable, expected) => {
      expect(
        evaluable.evaluate({
          RefA: 'A',
        })
      ).toStrictEqual(expected)
    })
  })

  describe('simplify', () => {
    it.each<[Evaluable, 'self' | unknown[]]>([
      [collection([reference('test'), value(10)]), 'self'],
      [collection([reference('refA'), value(10)]), [20, 10]],
      [collection([value(20), value(10)]), [20, 10]],
    ])('%p should simplify to %p', (evaluable, expected) => {
      expect(`${evaluable.simplify({ refA: 20 })}`).toBe(
        `${expected == 'self' ? evaluable : expected}`
      )
    })
  })

  describe('serialize', () => {
    const serializeOptions = {
      escapedOperators: new Set(['==']),
      escapeCharacter: DEFAULT_ESCAPE_CHARACTER,
    }

    it.each<[Evaluable, (number | string)[]]>([
      [
        collection([reference('test'), value(10)], serializeOptions),
        ['$test', 10],
      ],
      [
        collection([reference('refA'), value(10)], serializeOptions),
        ['$refA', 10],
      ],
      [
        collection([reference('refA'), value('testing')], serializeOptions),
        ['$refA', 'testing'],
      ],
      [collection([value(20), value(10)], serializeOptions), [20, 10]],
      [
        collection([value('=='), value(10), value(10)], serializeOptions),
        [`${DEFAULT_ESCAPE_CHARACTER}==`, 10, 10],
      ],
    ])('%p should be serialized to %p', (evaluable, expected) => {
      expect(evaluable.serialize()).toEqual(expected)
    })

    it('should use default serialization options', () => {
      expect(collection([value(20), value(10)]).serialize()).toStrictEqual([
        20, 10,
      ])
    })
  })

  describe('toString', () => {
    it.each([
      [collection([value(1)]), '[1]'],
      [collection([value('1')]), '["1"]'],
      [collection([value(true)]), '[true]'],
      [collection([reference('RefA')]), '[{RefA}]'],
      [collection([value(1), reference('RefA')]), '[1, {RefA}]'],
    ])('%p should be %p', (evaluable, expected) => {
      expect(evaluable.toString()).toBe(expected)
    })
  })

  describe('shouldBeEscaped', () => {
    const options1 = {
      escapedOperators: new Set<string>(['==']),
    }
    const options2 = { ...options1, escapeCharacter: '\\' }

    it.each([
      ['==', options2, true],
      ['==', undefined, false],
      ['==', options1, false],
      ['', options1, false],
    ])(
      '%p with options %p should be escaped: %p',
      (serialized, options, expected) => {
        expect(shouldBeEscaped(options)(serialized)).toBe(expected)
      }
    )
  })

  describe('escapeOperator', () => {
    const options = {
      escapedOperators: new Set<string>(),
      escapeCharacter: '\\',
    }

    it.each([
      ['==', options, '\\=='],
      ['==', undefined, '=='],
    ])(
      '%p with options %p should be escaped as %p',
      (serialized, options, expected) => {
        expect(escapeOperator(options)(serialized)).toBe(expected)
      }
    )
  })
})
