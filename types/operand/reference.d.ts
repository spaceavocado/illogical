import { Context, Evaluable, Evaluated } from '../evaluable';
export declare const KIND: unique symbol;
export declare type ReferenceSerializeOptions = {
    from: (operand: string) => undefined | string;
    to: (operand: string) => string;
};
export declare type ReferenceSimplifyOptions = {
    ignoredPaths: (RegExp | string)[];
};
export declare const defaultReferenceSerializeOptions: ReferenceSerializeOptions;
export declare enum DataType {
    Unknown = "Unknown",
    Number = "Number",
    String = "String"
}
export declare const isValidDataType: (type: unknown) => type is DataType;
export declare const getDataType: (path: string) => DataType;
export declare const trimDataType: (path: string) => string;
export declare const toNumber: (value: Evaluated) => number | undefined;
export declare const toString: (value: Evaluated) => string | undefined;
export declare const toDataType: (type: DataType) => (value: Evaluated) => Evaluated;
declare type contextPath = string;
declare type contextValue = unknown | undefined;
export declare const contextLookup: (context: Context, path: string) => [contextPath, contextValue];
export declare const isIgnoredPath: (ignoredPaths: (RegExp | string)[], path: string) => boolean;
export declare const reference: (path: string) => Evaluable;
export {};
