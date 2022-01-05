import { Evaluable } from '../../evaluable';
import { Comparison } from './comparison';
export declare const KIND: unique symbol;
export declare const ge: (left: Evaluable, right: Evaluable) => Comparison;
