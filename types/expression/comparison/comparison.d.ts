import { Optional } from '../../common/types';
import { Context, Evaluable, Evaluated } from '../../evaluable';
export declare type Comparison = Omit<Evaluable, 'evaluate'> & {
    operator: string;
    operands: Evaluable[];
    evaluate(context: Context): boolean;
    comparison(...results: Evaluated[]): boolean;
};
export declare const comparison: (evaluable: Omit<Optional<Comparison, 'toString'>, 'serialize' | 'simplify' | 'evaluate'>) => Comparison;
