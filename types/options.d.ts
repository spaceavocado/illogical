import { OperatorMapping } from './evaluable';
import { CollectionSerializeOptions } from './operand/collection';
import { ReferenceSerializeOptions, ReferenceSimplifyOptions } from './operand/reference';
export declare type Options = {
    serialize: {
        reference: ReferenceSerializeOptions;
        collection: Omit<CollectionSerializeOptions, 'escapedOperators'>;
    };
    simplify: {
        reference: ReferenceSimplifyOptions;
    };
    operatorMapping: OperatorMapping;
};
export declare const defaultOperatorMapping: Map<symbol, string>;
export declare const defaultOptions: Options;
export declare const overrideOptions: (base: Options) => (override: Record<string, unknown>) => Options;
