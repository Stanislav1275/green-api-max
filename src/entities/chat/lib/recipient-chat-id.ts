import { phoneToChatId } from '@/shared/lib/phone'

import type { Chat } from '../model/types'

export const getRecipientChatId = (chat: Pick<Chat, 'id' | 'phone'>) =>
  chat.phone ? phoneToChatId(chat.phone) : chat.id
