/**
 * Main module.
 * @module illogical
 */

export type { Evaluable, Context, Evaluated, Expression } from './evaluable'
export type {
  Illogical,
  Options,
  Operator,
  ReferenceSerializeOptions,
  ReferenceSimplifyOptions,
} from './illogical'

import { illogical } from './illogical'
export default illogical
