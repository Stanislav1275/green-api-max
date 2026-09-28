import { invariant } from '.'

it('returns present values and throws on missing ones', () => {
  expect(invariant(0, 'zero is fine')).toBe(0)
  expect(() => invariant(null, 'maxLength in spec')).toThrow('Invariant failed: maxLength in spec')
  expect(() => invariant(undefined, 'x')).toThrow('Invariant failed: x')
})
