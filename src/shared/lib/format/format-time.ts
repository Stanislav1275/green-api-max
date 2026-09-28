const formats = new Map<string, Intl.DateTimeFormat>()

/** Unix milliseconds → `14:05` in the given locale (formatters are cached per locale). */
export const formatTime = (timestamp: number, locale: string) => {
  let format = formats.get(locale)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' })
    formats.set(locale, format)
  }
  return format.format(timestamp)
}
