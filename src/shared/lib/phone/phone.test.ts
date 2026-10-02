import { formatPhone, normalizePhone, phoneSchema, phoneToChatId } from '.'

describe('normalizePhone', () => {
  it.each([
    ['+7 (999) 123-45-67', '79991234567'],
    ['8 999 123 45 67', '79991234567'],
    ['9991234567', '79991234567'],
    ['+44 20 7946 0958', '442079460958'],
    ['79991234567', '79991234567'],
  ])('%s → %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it.each(['', '12345', 'abc', '+7 999 abc 45 67', '1234567890123456'])('rejects «%s»', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

describe('formatPhone', () => {
  it('formats russian numbers', () => {
    expect(formatPhone('79991234567')).toBe('+7 999 123-45-67')
  })

  it('keeps other numbers as +digits', () => {
    expect(formatPhone('442079460958')).toBe('+442079460958')
  })
})

it('phoneToChatId builds a GREEN-API chat id', () => {
  expect(phoneToChatId('79991234567')).toBe('79991234567@c.us')
})

describe('phoneSchema', () => {
  it('outputs normalized digits', () => {
    expect(phoneSchema.parse(' 8 (999) 123-45-67 ')).toBe('79991234567')
  })

  it('asks for a number when empty', () => {
    expect(phoneSchema.safeParse('').error?.issues[0]?.message).toBe('validation.phoneRequired')
  })

  it('explains the format when invalid', () => {
    expect(phoneSchema.safeParse('123').error?.issues[0]?.message).toBe('validation.phoneFormat')
  })
})
