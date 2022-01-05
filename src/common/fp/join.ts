export const join =
  <T>(separator = ',') =>
  (collection: T[]): string =>
    collection.join(separator)
