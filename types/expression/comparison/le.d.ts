import { Evaluable } from '../../evaluable';
import { Comparison } from './comparison';
export declare const KIND: unique symbol;
export declare const le: (left: Evaluable, right: Evaluable) => Comparison;
