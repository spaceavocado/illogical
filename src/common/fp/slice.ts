export const slice =
  <T>(start?: number | undefined, end?: number | undefined) =>
  (collection: T[]): T[] =>
    collection.slice(start, end)
