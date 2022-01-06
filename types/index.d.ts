/**
 * Main module.
 * @module illogical
 */
export type { Evaluable } from './evaluable';
export type { Context, Evaluated, Expression } from './evaluable';
export { KIND_EQ, KIND_GE, KIND_GT, KIND_IN, KIND_LE, KIND_LT, KIND_NE, KIND_NOT_IN, KIND_OVERLAP, KIND_PREFIX, KIND_PRESENT, KIND_SUFFIX, KIND_UNDEF, } from './expression/comparison';
export { KIND_AND, KIND_NOR, KIND_NOT, KIND_OR, KIND_XOR, } from './expression/logical';
export type { Illogical } from './illogical';
export type { Options } from './options';
import { illogical } from './illogical';
export default illogical;
