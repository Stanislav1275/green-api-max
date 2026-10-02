import { formatTime } from '.'

it('formats unix ms as HH:mm in the given locale', () => {
  const morning = new Date(2026, 8, 28, 9, 5).getTime()
  expect(formatTime(morning, 'ru')).toBe('09:05')
  expect(formatTime(morning, 'en')).toBe('09:05 AM')
  expect(formatTime(morning, 'ru')).toBe('09:05')
})
