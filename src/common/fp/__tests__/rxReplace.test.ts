import { rxReplace } from '../rxReplace'

describe('common / fp / rxReplace', () => {
  it.each([
    ['bogus', /^bo/, 'xx', 'xxgus'],
    ['bogus', /^xx/, 'xx', 'bogus'],
  ])(
    '%p should be resolved with %p and %p as %p',
    (value, rx, replacement, expected) => {
      expect(rxReplace(rx, replacement)(value)).toBe(expected)
    }
  )
})
