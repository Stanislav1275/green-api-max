export type Country = {
  /** ISO 3166-1 alpha-2, lowercase */
  value: string
  label: string
  dialCode: string
  flag: string
}

export const DEFAULT_COUNTRY: Country = { value: 'ru', label: 'Россия', dialCode: '7', flag: '🇷🇺' }

/** Countries MAX accepts for sign-up (web.max.ru), Russia first. */
export const COUNTRIES: readonly Country[] = [
  DEFAULT_COUNTRY,
  { value: 'by', label: 'Беларусь', dialCode: '375', flag: '🇧🇾' },
  { value: 'az', label: 'Азербайджан', dialCode: '994', flag: '🇦🇿' },
  { value: 'am', label: 'Армения', dialCode: '374', flag: '🇦🇲' },
  { value: 'ge', label: 'Грузия', dialCode: '995', flag: '🇬🇪' },
  { value: 'kz', label: 'Казахстан', dialCode: '7', flag: '🇰🇿' },
  { value: 'kg', label: 'Кыргызстан', dialCode: '996', flag: '🇰🇬' },
  { value: 'md', label: 'Молдова', dialCode: '373', flag: '🇲🇩' },
  { value: 'tj', label: 'Таджикистан', dialCode: '992', flag: '🇹🇯' },
  { value: 'uz', label: 'Узбекистан', dialCode: '998', flag: '🇺🇿' },
]

/** Search by name or by dial code: «бел», «375», «+375». */
export const matchesCountry = (country: Country, query: string) => {
  const needle = query.trim().toLowerCase().replace(/^\+/, '')
  return country.label.toLowerCase().includes(needle) || country.dialCode.startsWith(needle)
}
