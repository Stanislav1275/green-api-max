import { COUNTRIES, type Country, DEFAULT_COUNTRY } from './countries'

/** National numbers in the supported countries are at least this long. */
const MIN_NATIONAL_DIGITS = 8

/**
 * Field value from the country picker and the typed number.
 * A number typed with `+` is taken as already international. A number that already carries
 * the country code (`79991234567`, `375291234567`) is not prefixed twice, and for +7 the
 * domestic trunk prefix is dropped (`8 999 …` → `+7 999 …`).
 */
export const composePhone = (country: Country, national: string) => {
  const trimmed = national.trim()
  if (trimmed === '' || trimmed.startsWith('+')) {
    return trimmed
  }
  const digits = trimmed.replace(/\D/g, '')
  const { dialCode } = country

  if (dialCode === '7' && digits.length === 11 && /^[78]/.test(digits)) {
    return `+7 ${digits.slice(1)}`
  }
  if (digits.startsWith(dialCode) && digits.length >= dialCode.length + MIN_NATIONAL_DIGITS) {
    return `+${digits}`
  }
  return `+${dialCode} ${trimmed}`
}

/** Inverse of `composePhone` for rendering: which country and what the user sees in the input. */
export const splitPhone = (value: string, current: Country = DEFAULT_COUNTRY) => {
  if (!value.startsWith('+')) {
    return { country: current, national: value }
  }
  const prefix = `+${current.dialCode} `
  if (value.startsWith(prefix)) {
    return { country: current, national: value.slice(prefix.length) }
  }
  const digits = value.replace(/\D/g, '')
  // longest dial code wins: +375 is Belarus, not +3…
  const country = [...COUNTRIES]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find(({ dialCode }) => digits.startsWith(dialCode))
  return country ? { country, national: value } : { country: current, national: value }
}
