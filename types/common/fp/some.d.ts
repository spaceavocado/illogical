import { Predicate } from './types';
export declare const some: <T>(predicate: Predicate<T>) => (items: T[]) => boolean;
