import { useMutation } from '@tanstack/react-query'

import { type Chat, getRecipientChatId, useChatStore } from '@/entities/chat'
import { useGreenApi } from '@/entities/session'

type SendMessageVariables = {
  chat: Pick<Chat, 'id' | 'phone'>
  text: string
  /** id of the optimistic bubble until the server assigns a real one */
  tempId: string
}

/** Optimistic send: the bubble appears immediately and is resolved by the API response. */
export const useSendMessage = () => {
  const api = useGreenApi()
  const addOutgoing = useChatStore((state) => state.addOutgoing)
  const resolveOutgoing = useChatStore((state) => state.resolveOutgoing)

  const mutation = useMutation({
    mutationFn: ({ chat, text }: SendMessageVariables) =>
      api.sendMessage({ chatId: getRecipientChatId(chat), message: text }),
    onMutate: ({ chat, text, tempId }) => {
      addOutgoing(chat.id, {
        id: tempId,
        text,
        direction: 'out',
        timestamp: Date.now(),
        status: 'pending',
      })
    },
    onSuccess: ({ idMessage }, { chat, tempId }) => {
      resolveOutgoing(chat.id, tempId, { id: idMessage, status: 'sent' })
    },
    onError: (_error, { chat, tempId }) => {
      resolveOutgoing(chat.id, tempId, { status: 'failed' })
    },
  })

  return {
    ...mutation,
    send: (chat: SendMessageVariables['chat'], text: string) => {
      mutation.mutate({ chat, text, tempId: `local-${crypto.randomUUID()}` })
    },
  }
}
