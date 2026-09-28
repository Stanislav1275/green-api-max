import { formatPhone } from '@/shared/lib/phone'

import type { Chat } from '../model/types'

export const getChatTitle = (chat: Chat) =>
  chat.name ?? (chat.phone ? formatPhone(chat.phone) : `Чат ${chat.id}`)
