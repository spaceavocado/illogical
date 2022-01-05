import { Evaluable, OperatorMapping } from '../evaluable';
import { Comparison } from '../expression/comparison';
import { Logical } from '../expression/logical';
import { ReferenceSerializeOptions } from '../operand/reference';
import { Options } from '../options';
export interface Parser {
    parse: (expression: unknown) => Evaluable;
}
declare type LogicalOrComparison = (...operands: Evaluable[]) => Logical | Comparison;
declare type ParsingOptions = {
    operatorExpressionMapping: Map<string, LogicalOrComparison>;
    referenceSerializeOptions: ReferenceSerializeOptions;
    escapeCharacter?: string;
};
export declare const toReferencePath: (value: unknown, options: ReferenceSerializeOptions) => string | undefined;
export declare const isEscaped: (value: unknown, escapeCharacter?: string | undefined) => boolean;
export declare const createOperand: (input: unknown | unknown[], options: ParsingOptions) => Evaluable;
export declare const createExpression: (expression: unknown[], options: ParsingOptions) => Logical | Comparison | undefined;
export declare const parse: (options: ParsingOptions) => (expression: unknown | unknown[]) => Evaluable;
export declare const operatorExpressionMapping: (operatorMapping: OperatorMapping) => Map<string, LogicalOrComparison>;
export declare const parser: (options: Options) => Parser;
export {};
