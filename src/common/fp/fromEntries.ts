export const fromEntries = <V>(entries: [string, V][]): { [k: string]: V } =>
  Object.fromEntries<V>(entries)
