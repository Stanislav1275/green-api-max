import { notificationBodySchema } from '@/shared/api'

export type MessageEvent = {
  id: string
  direction: 'in' | 'out'
  text: string
  /** unix milliseconds */
  timestamp: number
  maxChatId: string
  /** known only for incoming messages or when the chat id is `phone@c.us` */
  phone: string | null
  name: string | null
}

const DIRECTION_BY_WEBHOOK: Partial<Record<string, MessageEvent['direction']>> = {
  incomingMessageReceived: 'in',
  outgoingMessageReceived: 'out',
  outgoingAPIMessageReceived: 'out',
}

// empty strings mean "no name" in GREEN-API payloads
const pickName = (...names: (string | undefined)[]) => names.find((name) => name?.trim()) ?? null

const PHONE_CHAT_ID = /^(\d+)@c\.us$/

/** Extracts a text message from a notification; anything else (statuses, media, malformed) → `null`. */
export const parseNotification = (payload: unknown): MessageEvent | null => {
  // external data: validate against the OpenAPI-generated schema before trusting it
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
