import {
  Context,
  Evaluable,
  Evaluated,
  Expression,
  flattenContext,
} from './evaluable'
import {
  ReferenceSerializeOptions,
  ReferenceSimplifyOptions,
} from './operand/reference'
import { DEFAULT_OPERATOR_MAPPING, parser } from './parser'
import { Operator } from './parser/parser'

export type { ReferenceSerializeOptions, ReferenceSimplifyOptions }
export type { Operator }
export { DEFAULT_OPERATOR_MAPPING }

export type Illogical = {
  parse: (expression: Expression) => Evaluable
  evaluate: (expression: Expression, context?: Context) => Evaluated
  simplify: (expression: Expression, context?: Context) => Evaluated | Evaluable
  statement: (expression: Expression) => string
}

export interface Options {
  operatorMapping?: Map<Operator, string>
  serializeOptions?: ReferenceSerializeOptions
  simplifyOptions?: ReferenceSimplifyOptions
  escapeCharacter?: string
}

export const illogical = ({
  operatorMapping,
  serializeOptions,
  simplifyOptions,
  escapeCharacter,
}: Options = {}): Illogical =>
  ((parser) => ({
    parse: (expression: Expression) => parser.parse(expression),
    evaluate: (expression: Expression, context?: Context) =>
      parser.parse(expression).evaluate(flattenContext(context)),
    simplify: (expression: Expression, context?: Context) =>
      parser.parse(expression).simplify(flattenContext(context)),
    statement: (expression: Expression) => parser.parse(expression).toString(),
  }))(
    parser(operatorMapping, serializeOptions, simplifyOptions, escapeCharacter)
  )
