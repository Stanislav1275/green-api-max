import { formatTime } from '.'

it('formats unix ms as HH:mm', () => {
  expect(formatTime(new Date(2026, 8, 28, 9, 5).getTime())).toBe('09:05')
})
