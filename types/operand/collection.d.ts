import { Evaluable } from '../evaluable';
export declare const KIND: unique symbol;
export declare const isCollection: (evaluable: Evaluable) => boolean;
export declare type CollectionSerializeOptions = {
    escapedOperators: Set<string>;
    escapeCharacter?: string;
};
export declare const defaultEscapeCharacter = "\\";
export declare const shouldBeEscaped: (options?: CollectionSerializeOptions | undefined) => (serialized: unknown) => boolean;
export declare const escapeOperator: (options?: CollectionSerializeOptions | undefined) => (serialized: unknown) => string;
export declare const collection: (items: Evaluable[]) => Evaluable;
