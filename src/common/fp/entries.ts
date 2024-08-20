export const entries = <K extends string, V>(
  object: Record<K, V> | Map<K, V>
): [string, V][] =>
  object instanceof Map
    ? Array.from(object.entries())
    : Object.entries<V>(object)
