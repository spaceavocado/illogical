export const error = (message: string) => (): never => {
  throw new Error(message)
}
