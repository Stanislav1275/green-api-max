import { useMutation } from '@tanstack/react-query'

import { useChatStore } from '@/entities/chat'
import { useGreenApi } from '@/entities/session'
import { phoneToChatId } from '@/shared/lib/phone'

type SendMessageVariables = {
  chatId: string
  /** phone digits or a MAX numeric chat id */
  recipient: string
  text: string
}

/** Optimistic send: the bubble appears immediately and is resolved by the API response. */
export const useSendMessage = () => {
  const api = useGreenApi()
  const addOutgoing = useChatStore((state) => state.addOutgoing)
  const resolveOutgoing = useChatStore((state) => state.resolveOutgoing)

  return useMutation({
    mutationFn: ({ recipient, text }: SendMessageVariables) =>
      api.sendMessage({
        chatId: /^\d{10,15}$/.test(recipient) ? phoneToChatId(recipient) : recipient,
        message: text,
      }),
    onMutate: ({ chatId, text }) => {
      const tempId = `local-${crypto.randomUUID()}`
      addOutgoing(chatId, {
        id: tempId,
        text,
        direction: 'out',
        timestamp: Date.now(),
        status: 'pending',
      })
      return { tempId }
    },
    onSuccess: ({ idMessage }, { chatId }, context) => {
      resolveOutgoing(chatId, context.tempId, { id: idMessage, status: 'sent' })
    },
    onError: (_error, { chatId }, context) => {
      if (context) {
        resolveOutgoing(chatId, context.tempId, { status: 'failed' })
      }
    },
  })
}
