import { composePhone, COUNTRIES, DEFAULT_COUNTRY, matchesCountry, splitPhone } from '.'

const country = (value: string) => COUNTRIES.find((item) => item.value === value)!

describe('composePhone', () => {
  it.each([
    ['ru', '999 123 45 67', '+7 999 123 45 67'],
    ['ru', '8 999 123 45 67', '+7 9991234567'],
    ['ru', '89991234567', '+7 9991234567'],
    ['ru', '79991234567', '+7 9991234567'],
    ['by', '29 123 45 67', '+375 29 123 45 67'],
    ['by', '375291234567', '+375291234567'],
    ['by', '80291234567', '+375 80291234567'],
    ['ru', '+44 20 7946 0958', '+44 20 7946 0958'],
    ['ru', '  ', ''],
  ])('%s + «%s» → «%s»', (code, national, expected) => {
    expect(composePhone(country(code), national)).toBe(expected)
  })
})

describe('splitPhone', () => {
  it('keeps the chosen country when its prefix matches', () => {
    expect(splitPhone('+7 700 123 45 67', country('kz'))).toEqual({
      country: country('kz'),
      national: '700 123 45 67',
    })
  })

  it('detects the country of an international number by the longest dial code', () => {
    expect(splitPhone('+375 29 1234567')).toEqual({
      country: country('by'),
      national: '+375 29 1234567',
    })
  })

  it('leaves unknown codes and plain input to the current country', () => {
    expect(splitPhone('+44 20 7946 0958')).toEqual({
      country: DEFAULT_COUNTRY,
      national: '+44 20 7946 0958',
    })
    expect(splitPhone('999')).toEqual({ country: DEFAULT_COUNTRY, national: '999' })
  })
})

it('matchesCountry finds by name and by dial code', () => {
  expect(matchesCountry(country('by'), 'бел')).toBe(true)
  expect(matchesCountry(country('by'), '+375')).toBe(true)
  expect(matchesCountry(country('by'), 'рос')).toBe(false)
})
