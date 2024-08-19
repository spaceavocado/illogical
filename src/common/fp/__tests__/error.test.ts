import { error } from '../error'

describe('common / fp / error', () => {
  it.each([['error message']])('should throw as %p', (message) => {
    expect(() => error(message)()).toThrowError(message)
  })
})
