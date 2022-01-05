import { CollectionSerializeOptions } from './operand/collection';
import { ReferenceSerializeOptions, ReferenceSimplifyOptions } from './operand/reference';
export declare type Expression = Evaluated;
export declare type Context = Record<string, unknown>;
export declare type EvaluatedPrimitive = string | number | boolean | null;
export declare type EvaluatedValue = undefined | EvaluatedPrimitive;
export declare type Evaluated = EvaluatedValue | Array<Evaluated>;
export declare const isEvaluable: (value: unknown) => value is Evaluable;
export declare const isEvaluatedPrimitive: (value: unknown) => value is EvaluatedPrimitive;
export declare const isEvaluatedValue: (value: unknown) => value is EvaluatedValue;
export declare type OperatorMapping = Map<symbol, string>;
export declare type SimplifyOptions = Partial<{
    reference: ReferenceSimplifyOptions;
}>;
export declare type SerializeOptions = Partial<{
    operatorMapping: OperatorMapping;
    reference: ReferenceSerializeOptions;
    collection: CollectionSerializeOptions;
}>;
export interface Evaluable {
    kind: symbol;
    evaluate(context: Context): Evaluated;
    simplify(context: Context, options?: SimplifyOptions): Evaluated | Evaluable;
    serialize(options?: SerializeOptions): Expression;
    toString(): string;
}
export declare const evaluable: (evaluable: Evaluable) => Evaluable;
