import type { TFunction } from 'i18next'

import { formatPhone } from '@/shared/lib/phone'

import type { Chat } from '../model/types'

export const getChatTitle = (chat: Chat, t: TFunction) =>
  chat.name ?? (chat.phone ? formatPhone(chat.phone) : t('chats.fallbackTitle', { id: chat.id }))
