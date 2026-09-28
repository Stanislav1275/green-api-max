import { useShallow } from 'zustand/react/shallow'

import { useChatStore } from './chat-store'

export const useChatList = () =>
  useChatStore(
    useShallow((state) => Object.values(state.chats).sort((a, b) => b.updatedAt - a.updatedAt)),
  )

export const useActiveChat = () =>
  useChatStore((state) => (state.activeChatId ? state.chats[state.activeChatId] : undefined))
