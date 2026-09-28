import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizontal } from 'lucide-react'
import type { KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'

import type { Chat } from '@/entities/chat'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'

import {
  MAX_MESSAGE_LENGTH,
  sendMessageSchema,
  type SendMessageValues,
} from '../model/send-message-schema'
import { useSendMessage } from '../model/use-send-message'

export const SendMessageForm = ({ chat }: { chat: Chat }) => {
  const sendMessage = useSendMessage()
  const { register, handleSubmit, reset, formState } = useForm<SendMessageValues>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: { text: '' },
    mode: 'onChange',
  })

  const submit = handleSubmit(({ text }) => {
    sendMessage.mutate({ chatId: chat.id, recipient: chat.phone ?? chat.id, text })
    reset()
  })

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void submit()
    }
  }

  return (
    <form
      noValidate
      className="flex items-end gap-2 border-t bg-background p-3"
      onSubmit={(event) => void submit(event)}
    >
      <Textarea
        aria-label="Сообщение"
        placeholder="Сообщение"
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        className="rounded-2xl"
        {...register('text')}
        onKeyDown={handleKeyDown}
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full"
        aria-label="Отправить"
        disabled={!formState.isValid}
      >
        <SendHorizontal />
      </Button>
    </form>
  )
}
