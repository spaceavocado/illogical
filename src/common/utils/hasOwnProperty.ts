export const hasOwnProperty = (
  object: Record<string, unknown>,
  property: string | symbol
): boolean => Object.prototype.hasOwnProperty.call(object, property)
