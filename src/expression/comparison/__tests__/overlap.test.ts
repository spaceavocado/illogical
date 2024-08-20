import { collection, value } from '../../../operand'
import { overlap } from '../overlap'

describe('expression / comparison / overlap', () => {
  describe('evaluate', () => {
    it.each([
      // Truthy
      [collection([value(0)]), collection([value(0), value(1)]), true],
      [collection([value(1)]), collection([value(1)]), true],
      [
        collection([value(3), value(2)]),
        collection([value(1), value(2), value(3)]),
        true,
      ],
      [collection([value('1')]), collection([value('1')]), true],
      [collection([value(true)]), collection([value(true)]), true],
      [collection([value(null)]), collection([value(null)]), true],
      [value(1), value(1), true],
      [collection([value(1)]), value(1), true],
      [value(1), collection([value(1)]), true],
      // Falsy
      [collection([value(0)]), collection([value(1)]), false],
      [collection([value(1)]), collection([value(0)]), false],
      [collection([value(false)]), value(true), false],
      [value(null), collection([value(1)]), false],
    ])('%p, %p should evaluate as %p', (left, right, expected) => {
      expect(overlap(left, right).evaluate()).toBe(expected)
    })
  })
})
