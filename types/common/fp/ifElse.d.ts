import { Predicate } from './types';
export declare const ifElse: <T, S, U>(predicate: Predicate<T>, onTrue: (value: T) => S, onFalse: (value: T) => U) => (value: T) => S | U;
