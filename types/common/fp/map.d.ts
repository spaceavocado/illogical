import { Functor } from './types';
export declare const map: <T, U>(fn: (item: T) => U) => (functor: Functor<T>) => U[];
