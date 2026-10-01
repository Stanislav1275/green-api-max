export type MessageStatus = 'pending' | 'sent' | 'failed'

export type Message = {
  id: string
  text: string
  direction: 'in' | 'out'
  timestamp: number
  status: MessageStatus
}

export type Chat = {
  id: string
  phone: string | null
  maxChatId: string | null
  name: string | null
  messages: Message[]
  updatedAt: number
}
