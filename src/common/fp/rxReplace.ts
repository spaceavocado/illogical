export const rxReplace =
  (rx: RegExp, replacement: string) =>
  (subject: string): string =>
    subject.replace(rx, replacement)
