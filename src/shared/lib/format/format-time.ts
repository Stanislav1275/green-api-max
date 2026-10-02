const formats = new Map<string, Intl.DateTimeFormat>()

export const formatTime = (timestamp: number, locale: string) => {
  let format = formats.get(locale)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' })
    formats.set(locale, format)
  }
  return format.format(timestamp)
}
