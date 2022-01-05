import { constant } from '../constant'

describe('common / fp / constant', () => {
  it('should return itself', () => {
    const value = Symbol()
    expect(constant(value)()).toBe(value)
  })
})
