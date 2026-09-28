export type MessageStatus = 'pending' | 'sent' | 'failed'

export type Message = {
  id: string
  text: string
  direction: 'in' | 'out'
  /** unix milliseconds */
  timestamp: number
  status: MessageStatus
}

export type Chat = {
  /** chat key: international phone digits, or a MAX chat id when the phone is unknown */
  id: string
  phone: string | null
  /** numeric id MAX uses in notifications instead of `phone@c.us` */
  maxChatId: string | null
  name: string | null
  messages: Message[]
  updatedAt: number
}
