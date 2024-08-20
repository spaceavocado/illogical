export const values = <K extends string | number | symbol, V>(
  object: Record<K, V> | Map<K, V>
): V[] =>
  object instanceof Map ? Array.from(object.values()) : Object.values<V>(object)
