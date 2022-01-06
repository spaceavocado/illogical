import { Evaluable } from '../../evaluable';
import { Comparison } from './comparison';
export declare const KIND: unique symbol;
export declare const In: (left: Evaluable, right: Evaluable) => Comparison;
