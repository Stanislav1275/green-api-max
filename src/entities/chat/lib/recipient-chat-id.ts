import { phoneToChatId } from '@/shared/lib/phone'

import type { Chat } from '../model/types'

/** Where GREEN-API should deliver: `phone@c.us` when the phone is known, else the MAX chat id. */
export const getRecipientChatId = (chat: Pick<Chat, 'id' | 'phone'>) =>
  chat.phone ? phoneToChatId(chat.phone) : chat.id
