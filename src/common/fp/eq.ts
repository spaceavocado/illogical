export const eq =
  <T>(expected: T) =>
  (value: unknown): value is T =>
    expected === value
