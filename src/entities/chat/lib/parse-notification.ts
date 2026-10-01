import { notificationBodySchema } from '@/shared/api'

export type MessageEvent = {
  id: string
  direction: 'in' | 'out'
  text: string
  timestamp: number
  maxChatId: string
  phone: string | null
  name: string | null
}

const DIRECTION_BY_WEBHOOK: Partial<Record<string, MessageEvent['direction']>> = {
  incomingMessageReceived: 'in',
  outgoingMessageReceived: 'out',
  outgoingAPIMessageReceived: 'out',
}

const pickName = (...names: (string | undefined)[]) => names.find((name) => name?.trim()) ?? null

const PHONE_CHAT_ID = /^(\d+)@c\.us$/

export const parseNotification = (payload: unknown): MessageEvent | null => {
  const parsed = notificationBodySchema.safeParse(payload)
  if (!parsed.success) {
    return null
  }
  const body = parsed.data
  const direction = DIRECTION_BY_WEBHOOK[body.typeWebhook]
  const { senderData, messageData, idMessage } = body
  const text =
    messageData?.textMessageData?.textMessage ?? messageData?.extendedTextMessageData?.text

  if (!direction || !senderData || !idMessage || text === undefined) {
    return null
  }

  const phoneFromChatId = PHONE_CHAT_ID.exec(senderData.chatId)?.[1] ?? null
  const senderPhone =
    direction === 'in' && senderData.senderPhoneNumber ? String(senderData.senderPhoneNumber) : null

  return {
    id: idMessage,
    direction,
    text,
    timestamp: body.timestamp * 1000,
    maxChatId: senderData.chatId,
    phone: senderPhone ?? phoneFromChatId,
    name: direction === 'in' ? pickName(senderData.senderContactName, senderData.senderName) : null,
  }
}
