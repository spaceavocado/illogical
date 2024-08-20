import {
  cond,
  constant,
  eq,
  error,
  ifElse,
  pipe,
  rxMatches,
  rxReplace,
  some,
  stubTrue,
} from '../common/fp'
import {
  isBoolean,
  isNumber,
  isString,
  isUndefined,
} from '../common/type-check/'
import { asExpected } from '../common/utils'
import { Context, Evaluable, Evaluated, flattenContext } from '../evaluable'

const NESTED_REFERENCE_RX = /{([^{}]+)}/
const DATA_TYPE_RX = /^.+\.\(([A-Z][a-z]+)\)$/
const DATA_TYPE_TRIM_RX = /.\(([A-Z][a-z]+)\)$/
const FLOAT_TRIM_RX = /"\.\d+/
const FLOAT_RX = /^\d+\.\d+$/
const INT_RX = /^0$|^[1-9]\d*$/

export type ReferenceSerializeOptions = {
  from: (operand: string) => undefined | string
  to: (operand: string) => string
}

export type ReferenceSimplifyOptions = {
  ignoredPaths: (RegExp | string)[]
}

export const defaultReferenceSerializeOptions: ReferenceSerializeOptions = {
  from: (operand: string) =>
    operand.length > 1 && operand.startsWith('$')
      ? operand.slice(1)
      : undefined,
  to: (operand: string) => `$${operand}`,
}

export enum DataType {
  Unknown = 'Unknown',
  Unsupported = 'Unsupported',
  Number = 'Number',
  Integer = 'Integer',
  Float = 'Float',
  String = 'String',
  Boolean = 'Boolean',
}

export const isValidDataType = (input: unknown): input is DataType =>
  `${input}` in DataType &&
  ![DataType.Unknown, DataType.Unsupported].includes(
    asExpected<DataType>(input)
  )

export const getDataType = (
  path: string,
  dataTypeRx = DATA_TYPE_RX
): DataType =>
  cond([
    [eq(null), constant(DataType.Unknown)],
    [isValidDataType, (dataType) => asExpected<DataType>(dataType)],
    [
      stubTrue,
      (dataType) => {
        console.warn(`unsupported "${dataType}" type casting`)
        return DataType.Unsupported
      },
    ],
  ])(((match) => (match ? match[1] : null))(path.match(dataTypeRx)))

export const trimDataType = (
  path: string,
  trimDataTypeRx = DATA_TYPE_TRIM_RX
): string => path.replace(trimDataTypeRx, '')

export const toNumber = (
  value: unknown,
  intRx = INT_RX,
  floatRx = FLOAT_RX
): number | undefined =>
  cond([
    [isNumber, constant(asExpected<number>(value))],
    [isBoolean, (value) => (value === true ? 1 : 0)],
    [
      isString,
      (value) =>
        cond([
          [rxMatches(floatRx), parseFloat],
          [rxMatches(intRx), parseInt],
          [
            stubTrue,
            error(`invalid conversion from "${value}" text to number`),
          ],
        ])(`${value}`),
    ],
    [stubTrue, error(`invalid conversion from "${value}" to number`)],
  ])(value)

export const toInt = (
  value: unknown,
  intRx = INT_RX,
  floatRx = FLOAT_RX,
  floatTrimRx = FLOAT_TRIM_RX
): number | undefined =>
  cond([
    [isNumber, pipe(asExpected<number>, Math.floor)],
    [isBoolean, (value) => (value === true ? 1 : 0)],
    [
      isString,
      (value) =>
        cond([
          [rxMatches(floatRx), pipe(rxReplace(floatTrimRx, ''), parseInt)],
          [rxMatches(intRx), parseInt],
          [stubTrue, error(`invalid conversion from "${value}" text to int`)],
        ])(`${value}`),
    ],
    [stubTrue, error(`invalid conversion from "${value}" to int`)],
  ])(value)

export const toFloat = (
  value: unknown,
  intRx = INT_RX,
  floatRx = FLOAT_RX
): number | undefined =>
  cond([
    [isNumber, constant(asExpected<number>(value))],
    [isBoolean, (value) => (value === true ? 1.0 : 0.0)],
    [
      isString,
      (value) =>
        cond([
          [rxMatches(floatRx), parseFloat],
          [rxMatches(intRx), parseFloat],
          [stubTrue, error(`invalid conversion from "${value}" text to float`)],
        ])(`${value}`),
    ],
    [stubTrue, error(`invalid conversion from "${value}" to float`)],
  ])(value)

export const toString = (value: unknown): string | undefined =>
  cond([
    [isString, constant(asExpected<string>(value))],
    [stubTrue, (value) => `${value}`],
  ])(value)

export const toBoolean = (value: unknown): boolean | undefined =>
  cond([
    [isBoolean, constant(asExpected<boolean>(value))],
    [
      isNumber,
      cond([
        [eq(0), constant(false)],
        [eq(1), constant(true)],
        [
          stubTrue,
          error(`invalid conversion from "${value}" number to boolean`),
        ],
      ]),
    ],
    [
      isString,
      (value) =>
        cond([
          [rxMatches(/^true|1$/), constant(true)],
          [rxMatches(/^false|0$/), constant(false)],
          [
            stubTrue,
            error(`invalid conversion from "${value}" text to boolean`),
          ],
        ])(`${value}`.trim().toLowerCase()),
    ],
    [stubTrue, error(`invalid conversion from "${value}" to boolean`)],
  ])(value)

export const toDataType =
  (type: DataType) =>
  (value: unknown): Evaluated =>
    cond<DataType, Evaluated>([
      [eq(DataType.Number), () => toNumber(value)],
      [eq(DataType.Integer), () => toInt(value)],
      [eq(DataType.Float), () => toFloat(value)],
      [eq(DataType.Boolean), () => toBoolean(value)],
      [eq(DataType.String), () => toString(value)],
      [stubTrue, constant(asExpected<Evaluated>(value))],
    ])(isUndefined(value) ? DataType.Unknown : type)

type foundContextValue = boolean
type contextPath = string
type contextValue = unknown | undefined

export const contextLookup = (
  context: Context | undefined,
  path: string,
  nestedReferenceRx = NESTED_REFERENCE_RX
): [foundContextValue, contextPath, contextValue] => {
  if (isUndefined(context)) {
    return [false, path, undefined]
  }

  let match = path.match(nestedReferenceRx)
  while (match) {
    const [found, , value] = contextLookup(context, match[1], nestedReferenceRx)
    if (!found) {
      return [false, path, undefined]
    }

    path =
      path.slice(0, match.index) +
      value +
      path.slice(Number(match.index) + match[0].length)
    match = path.match(nestedReferenceRx)
  }

  // eslint-disable-next-line no-prototype-builtins
  return context.hasOwnProperty(path)
    ? [true, path, context[path]]
    : [false, path, undefined]
}

export const isIgnoredPath = (
  ignoredPaths: (RegExp | string)[],
  path: string
): boolean =>
  some((pattern: string | RegExp) => !!path.match(pattern))(ignoredPaths)

export const evaluate = (
  context: Context | undefined,
  path: string,
  dataType: DataType
): [foundContextValue, contextPath, Evaluated] =>
  (([found, resolvedPath, value]) => [
    found,
    resolvedPath,
    found ? toDataType(dataType)(value) : undefined,
  ])(contextLookup(flattenContext(context), path))

export const reference = (
  address: string,
  serializeOptions: ReferenceSerializeOptions = defaultReferenceSerializeOptions,
  simplifyOptions?: ReferenceSimplifyOptions
): Evaluable =>
  ((path: string, dataType: DataType) => ({
    evaluate: (context) =>
      (([, , result]) => result)(evaluate(context, path, dataType)),
    simplify: function (context) {
      return ifElse(
        ([found, resolvedPath]: [
          foundContextValue,
          contextPath,
          contextValue
        ]) =>
          found &&
          !isIgnoredPath(simplifyOptions?.ignoredPaths ?? [], resolvedPath),
        ([, , value]) => asExpected<Evaluated>(value),
        () => this
      )(evaluate(context, path, dataType))
    },
    serialize: () =>
      serializeOptions.to(
        ifElse(
          eq(DataType.Unknown),
          constant(path),
          constant(`${path}.(${dataType})`)
        )(dataType)
      ),
    toString: () => `{${address}}`,
  }))(trimDataType(address), getDataType(address))
