/* eslint-disable @typescript-eslint/no-use-before-define */
import { entries, fromEntries, map, pipe, values } from '../common/fp'
import { isArray, isString, isUndefined } from '../common/type-check'
import { asExpected } from '../common/utils'
import { Evaluable, EvaluatedValue, isEvaluatedPrimitive } from '../evaluable'
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
} from '../expression/comparison'
import { and, nor, not, or, xor } from '../expression/logical'
import {
  collection,
  DEFAULT_ESCAPE_CHARACTER,
  reference,
  value,
} from '../operand'
import {
  defaultReferenceSerializeOptions,
  ReferenceSerializeOptions,
  ReferenceSimplifyOptions,
} from '../operand/reference'

export class UnexpectedExpressionInputError extends Error {}
export class UnexpectedExpressionError extends Error {}
export class UnexpectedOperandError extends Error {}

export interface Parser {
  parse: (expression: unknown) => Evaluable
}

export type Options = {
  operatorHandlerMapping: Record<string, (operands: Evaluable[]) => Evaluable>
  serializeOptions: ReferenceSerializeOptions
  simplifyOptions?: ReferenceSimplifyOptions
  escapeCharacter: string
  escapedOperators: Set<string>
}

export enum Operator {
  AND,
  OR,
  NOR,
  XOR,
  NOT,
  EQ,
  NE,
  GT,
  GE,
  LT,
  LE,
  IN,
  NOTIN,
  OVERLAP,
  PREFIX,
  SUFFIX,
  NONE,
  PRESENT,
}

export const DEFAULT_OPERATOR_MAPPING = new Map<Operator, string>([
  // Logical
  [Operator.AND, 'AND'],
  [Operator.OR, 'OR'],
  [Operator.NOR, 'NOR'],
  [Operator.XOR, 'XOR'],
  [Operator.NOT, 'NOT'],
  // Comparison
  [Operator.EQ, '=='],
  [Operator.NE, '!='],
  [Operator.GT, '>'],
  [Operator.GE, '>='],
  [Operator.LT, '<'],
  [Operator.LE, '<='],
  [Operator.NONE, 'NONE'],
  [Operator.PRESENT, 'PRESENT'],
  [Operator.IN, 'IN'],
  [Operator.NOTIN, 'NOT IN'],
  [Operator.OVERLAP, 'OVERLAP'],
  [Operator.PREFIX, 'PREFIX'],
  [Operator.SUFFIX, 'SUFFIX'],
])

export const toReferenceAddress = (
  value: unknown,
  options: ReferenceSerializeOptions
): string | undefined => (isString(value) ? options.from(value) : undefined)

export const isEscaped = (value: unknown, escapeCharacter?: string): boolean =>
  !isUndefined(escapeCharacter) &&
  isString(value) &&
  value.startsWith(escapeCharacter)

export const unaryExpression =
  (handler: (operand: Evaluable) => Evaluable) =>
  (operands: Evaluable[]): Evaluable =>
    handler(operands[0])

export const binaryExpression =
  (handler: (left: Evaluable, right: Evaluable) => Evaluable) =>
  (operands: Evaluable[]): Evaluable =>
    handler(operands[0], operands[1])

export const multiaryExpression =
  (handler: (operands: Evaluable[]) => Evaluable) =>
  (operands: Evaluable[]): Evaluable =>
    handler(operands)

export const createOperand =
  (options: Options) =>
  (input: unknown): Evaluable => {
    if (isArray(input)) {
      if (!input.length) {
        throw new UnexpectedOperandError('collection operand must have items')
      }
      return collection(input.map(parse(options)), {
        escapedOperators: options.escapedOperators,
        escapeCharacter: options.escapeCharacter,
      })
    }

    const address = toReferenceAddress(input, options.serializeOptions)
    if (address) {
      return reference(
        address,
        options.serializeOptions,
        options.simplifyOptions
      )
    }

    if (!isUndefined(value) && !isEvaluatedPrimitive(input)) {
      throw new UnexpectedOperandError(
        'value operand must be a primitive value, number, text, bool and/or null'
      )
    }

    return value(asExpected<EvaluatedValue>(input))
  }

export const createExpression =
  (options: Options) =>
  (expression: unknown[]): Evaluable => {
    const [operator, ...operands] = expression

    if (!isString(operator)) {
      throw new UnexpectedExpressionError(
        `expression must have a valid operator, got ${operator}`
      )
    }

    if (!options.operatorHandlerMapping[operator]) {
      throw new UnexpectedExpressionError(
        `missing expression handler for ${operator}`
      )
    }

    return options.operatorHandlerMapping[operator](
      operands.map(parse(options))
    )
  }

export const parse =
  (options: Options) =>
  (expression?: unknown | unknown[]): Evaluable => {
    if (isUndefined(expression)) {
      throw new UnexpectedExpressionInputError('input cannot be undefined')
    }

    if (!isArray(expression)) {
      return createOperand(options)(expression)
    }

    if (expression.length < 2) {
      return createOperand(options)(expression)
    }

    if (
      isString(expression[0]) &&
      isEscaped(expression[0], options.escapeCharacter)
    ) {
      return createOperand(options)([
        expression[0].slice(1),
        ...expression.slice(1),
      ])
    }

    try {
      return createExpression(options)(expression)
    } catch (error) {
      if (error instanceof UnexpectedExpressionError) {
        return createOperand(options)(expression)
      }
      throw error
    }
  }

export const options =
  (
    defaultOperatorMapping = DEFAULT_OPERATOR_MAPPING,
    defaultSerializeOptions = defaultReferenceSerializeOptions,
    defaultEscapeCharacter = DEFAULT_ESCAPE_CHARACTER
  ) =>
  (
    operatorMapping?: Map<Operator, string>,
    serializeOptions?: ReferenceSerializeOptions,
    simplifyOptions?: ReferenceSimplifyOptions,
    escapeCharacter?: string
  ): Options => {
    const operatorSymbol: Record<Operator, string> = pipe(
      entries,
      map(([operator, symbol]) => [
        operator,
        operatorMapping?.get(asExpected<Operator>(operator)) ?? symbol,
      ]),
      fromEntries
    )(defaultOperatorMapping)

    return {
      operatorHandlerMapping: {
        // Logical
        [operatorSymbol[Operator.AND]]: multiaryExpression((operands) =>
          and(operands, operatorSymbol[Operator.AND])
        ),
        [operatorSymbol[Operator.OR]]: multiaryExpression((operands) =>
          or(operands, operatorSymbol[Operator.OR])
        ),
        [operatorSymbol[Operator.NOR]]: multiaryExpression((operands) =>
          nor(
            operands,
            operatorSymbol[Operator.NOR],
            operatorSymbol[Operator.NOT]
          )
        ),
        [operatorSymbol[Operator.XOR]]: multiaryExpression((operands) =>
          xor(
            operands,
            operatorSymbol[Operator.XOR],
            operatorSymbol[Operator.NOT],
            operatorSymbol[Operator.NOR]
          )
        ),
        [operatorSymbol[Operator.NOT]]: unaryExpression((operand) =>
          not(operand, operatorSymbol[Operator.NOT])
        ),
        // Comparison
        [operatorSymbol[Operator.EQ]]: binaryExpression((left, right) =>
          eq(left, right, operatorSymbol[Operator.EQ])
        ),
        [operatorSymbol[Operator.NE]]: binaryExpression((left, right) =>
          ne(left, right, operatorSymbol[Operator.NE])
        ),
        [operatorSymbol[Operator.GT]]: binaryExpression((left, right) =>
          gt(left, right, operatorSymbol[Operator.GT])
        ),
        [operatorSymbol[Operator.GE]]: binaryExpression((left, right) =>
          ge(left, right, operatorSymbol[Operator.GE])
        ),
        [operatorSymbol[Operator.LT]]: binaryExpression((left, right) =>
          lt(left, right, operatorSymbol[Operator.LT])
        ),
        [operatorSymbol[Operator.LE]]: binaryExpression((left, right) =>
          le(left, right, operatorSymbol[Operator.LE])
        ),
        [operatorSymbol[Operator.NONE]]: unaryExpression((operand) =>
          undef(operand, operatorSymbol[Operator.NONE])
        ),
        [operatorSymbol[Operator.PRESENT]]: unaryExpression((operand) =>
          present(operand, operatorSymbol[Operator.PRESENT])
        ),
        [operatorSymbol[Operator.IN]]: binaryExpression((left, right) =>
          In(left, right, operatorSymbol[Operator.IN])
        ),
        [operatorSymbol[Operator.NOTIN]]: binaryExpression((left, right) =>
          notIn(left, right, operatorSymbol[Operator.NOTIN])
        ),
        [operatorSymbol[Operator.OVERLAP]]: binaryExpression((left, right) =>
          overlap(left, right, operatorSymbol[Operator.OVERLAP])
        ),
        [operatorSymbol[Operator.PREFIX]]: binaryExpression((left, right) =>
          prefix(left, right, operatorSymbol[Operator.PREFIX])
        ),
        [operatorSymbol[Operator.SUFFIX]]: binaryExpression((left, right) =>
          suffix(left, right, operatorSymbol[Operator.SUFFIX])
        ),
      },
      serializeOptions: serializeOptions ?? defaultSerializeOptions,
      simplifyOptions,
      escapeCharacter: escapeCharacter ?? defaultEscapeCharacter,
      escapedOperators: new Set<string>(values(operatorSymbol)),
    }
  }

export const parser = (
  operatorMapping?: Map<Operator, string>,
  serializeOptions?: ReferenceSerializeOptions,
  simplifyOptions?: ReferenceSimplifyOptions,
  escapeCharacter?: string
): Parser => ({
  parse: parse(
    options(
      DEFAULT_OPERATOR_MAPPING,
      defaultReferenceSerializeOptions,
      DEFAULT_ESCAPE_CHARACTER
    )(operatorMapping, serializeOptions, simplifyOptions, escapeCharacter)
  ),
})
