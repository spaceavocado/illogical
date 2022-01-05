import { Evaluable } from '../../evaluable';
import { Logical } from './logical';
export declare const KIND: unique symbol;
export declare const xor: (...operands: Evaluable[]) => Logical;
