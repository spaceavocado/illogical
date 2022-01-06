import { Optional } from '../../common/types';
import { Context, Evaluable } from '../../evaluable';
export declare type Logical = Omit<Evaluable, 'evaluate'> & {
    operator: string;
    operands: Evaluable[];
    evaluate(context: Context): boolean;
};
export declare const logical: (evaluable: Omit<Optional<Logical, 'toString'>, 'serialize'>) => Logical;
