const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })

/** Unix milliseconds → `14:05` */
export const formatTime = (timestamp: number) => timeFormat.format(timestamp)
