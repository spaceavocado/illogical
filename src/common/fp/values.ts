export const values = <K extends string | number | symbol, V>(
  object: Record<K, V>
): V[] => Object.values(object)
