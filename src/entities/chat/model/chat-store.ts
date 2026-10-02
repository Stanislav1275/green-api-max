import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { MessageEvent } from '../lib/parse-notification'
import type { Chat, Message } from './types'

type ChatState = {
  chats: Record<string, Chat>
  activeChatId: string | null
  openChat: (phone: string) => void
  closeChat: () => void
  addOutgoing: (chatId: string, message: Message) => void
  resolveOutgoing: (chatId: string, tempId: string, patch: Partial<Message>) => void
  applyEvent: (event: MessageEvent) => void
  reset: () => void
}

const emptyChat = (id: string, phone: string | null, updatedAt = Date.now()): Chat => ({
  id,
  phone,
  maxChatId: null,
  name: null,
  messages: [],
  updatedAt,
})

const upsertMessage = (messages: Message[], message: Message) =>
  messages.some(({ id }) => id === message.id)
    ? messages
    : [...messages, message].sort((a, b) => a.timestamp - b.timestamp)

const findChat = (chats: Record<string, Chat>, event: MessageEvent) =>
  Object.values(chats).find(
    (chat) =>
      (event.phone !== null && chat.phone === event.phone) ||
      chat.maxChatId === event.maxChatId ||
      chat.messages.some(({ id }) => id === event.id),
  )

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: {},
      activeChatId: null,

      openChat: (phone) => {
        set((state) => ({
          activeChatId: phone,
          chats: state.chats[phone]
            ? state.chats
            : { ...state.chats, [phone]: emptyChat(phone, phone) },
        }))
      },

      closeChat: () => {
        set({ activeChatId: null })
      },

      addOutgoing: (chatId, message) => {
        set((state) => {
          const chat = state.chats[chatId]
          if (!chat) {
            return state
          }
          return {
            chats: {
              ...state.chats,
              [chatId]: {
                ...chat,
                messages: upsertMessage(chat.messages, message),
                updatedAt: message.timestamp,
              },
            },
          }
        })
      },

      resolveOutgoing: (chatId, tempId, patch) => {
        set((state) => {
          const chat = state.chats[chatId]
          if (!chat) {
            return state
          }
          const alreadyReceived =
            patch.id !== undefined && chat.messages.some(({ id }) => id === patch.id)
          const messages = alreadyReceived
            ? chat.messages.filter(({ id }) => id !== tempId)
            : chat.messages.map((message) =>
                message.id === tempId ? { ...message, ...patch } : message,
              )
          return { chats: { ...state.chats, [chatId]: { ...chat, messages } } }
        })
      },

      applyEvent: (event) => {
        set((state) => {
          const existing = findChat(state.chats, event)
          const chat =
            existing ?? emptyChat(event.phone ?? event.maxChatId, event.phone, event.timestamp)
          const message: Message = {
            id: event.id,
            text: event.text,
            direction: event.direction,
            timestamp: event.timestamp,
            status: 'sent',
          }
          return {
            chats: {
              ...state.chats,
              [chat.id]: {
                ...chat,
                phone: chat.phone ?? event.phone,
                maxChatId: event.maxChatId,
                name: event.name ?? chat.name,
                messages: upsertMessage(chat.messages, message),
                updatedAt: Math.max(chat.updatedAt, event.timestamp),
              },
            },
          }
        })
      },

      reset: () => {
        set({ chats: {}, activeChatId: null })
      },
    }),
    {
      name: 'green-api-max/chats',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ chats }) => ({ chats }),
    },
  ),
)
