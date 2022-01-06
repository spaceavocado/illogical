import { Predicate } from './types';
export declare const cond: <T, S>(pairs: [Predicate<T>, (value: T) => S][]) => (value: T) => S;
