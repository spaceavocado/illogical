export const entries = <K extends string | number, V>(
  object: Record<K, V>
): [string, V][] => Object.entries<V>(object)
