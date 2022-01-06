import { Context, Evaluable, Evaluated, Expression } from './evaluable';
import { Options } from './options';
export declare type Illogical = {
    evaluate: (expression: Expression, context: Context) => Evaluated;
    parse: (expression: Expression) => Evaluable;
    statement: (expression: Expression) => string;
    simplify: (expression: Expression, context: Context, ignoredPaths?: (RegExp | string)[]) => Expression;
};
export declare const illogical: (options?: Partial<Options> | undefined) => Illogical;
