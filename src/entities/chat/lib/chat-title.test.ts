import type { Chat } from '../model/types'
import { getChatTitle } from './chat-title'

const chat = (overrides: Partial<Chat>): Chat => ({
  id: '10000000',
  phone: null,
  maxChatId: null,
  name: null,
  messages: [],
  updatedAt: 0,
  ...overrides,
})

it.each([
  [{ name: 'Анна', phone: '79991234567' }, 'Анна'],
  [{ phone: '79991234567' }, '+7 999 123-45-67'],
  [{}, 'Чат 10000000'],
])('getChatTitle(%o) → %s', (overrides, title) => {
  expect(getChatTitle(chat(overrides))).toBe(title)
})
