import { Monoid } from './types';
export declare const reduce: <T, S>(fn: (acc: S, cur: T) => S, zero?: S | undefined) => (monoid: Monoid<T>) => S;
