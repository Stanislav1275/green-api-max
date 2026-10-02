export type CountryCode = 'ru' | 'by' | 'az' | 'am' | 'ge' | 'kz' | 'kg' | 'md' | 'tj' | 'uz'

export type Country = {
  value: CountryCode
  dialCode: string
  flag: string
}

export const DEFAULT_COUNTRY: Country = { value: 'ru', dialCode: '7', flag: '🇷🇺' }

export const COUNTRIES: readonly Country[] = [
  DEFAULT_COUNTRY,
  { value: 'by', dialCode: '375', flag: '🇧🇾' },
  { value: 'az', dialCode: '994', flag: '🇦🇿' },
  { value: 'am', dialCode: '374', flag: '🇦🇲' },
  { value: 'ge', dialCode: '995', flag: '🇬🇪' },
  { value: 'kz', dialCode: '7', flag: '🇰🇿' },
  { value: 'kg', dialCode: '996', flag: '🇰🇬' },
  { value: 'md', dialCode: '373', flag: '🇲🇩' },
  { value: 'tj', dialCode: '992', flag: '🇹🇯' },
  { value: 'uz', dialCode: '998', flag: '🇺🇿' },
]

export const matchesCountry = (country: Country, label: string, query: string) => {
  const needle = query.trim().toLowerCase().replace(/^\+/, '')
  return label.toLowerCase().includes(needle) || country.dialCode.startsWith(needle)
}
