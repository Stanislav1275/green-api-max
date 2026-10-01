import { COUNTRIES, type Country, DEFAULT_COUNTRY } from './countries'

const MIN_NATIONAL_DIGITS = 8

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

export const splitPhone = (value: string, current: Country = DEFAULT_COUNTRY) => {
  if (!value.startsWith('+')) {
    return { country: current, national: value }
  }
  const prefix = `+${current.dialCode} `
  if (value.startsWith(prefix)) {
    return { country: current, national: value.slice(prefix.length) }
  }
  const digits = value.replace(/\D/g, '')
  const country = [...COUNTRIES]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find(({ dialCode }) => digits.startsWith(dialCode))
  return country ? { country, national: value } : { country: current, national: value }
}
