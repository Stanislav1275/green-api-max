import { SendHorizontal } from 'lucide-react'
import type { KeyboardEvent } from 'react'

import type { Chat } from '@/entities/chat'
import { useZodForm } from '@/shared/lib/form'
import { Form, FormField, FormSubmit } from '@/shared/ui/form'
import { Textarea } from '@/shared/ui/textarea'

import { MAX_MESSAGE_LENGTH, sendMessageSchema } from '../model/send-message-schema'
import { useSendMessage } from '../model/use-send-message'

// Enter sends, Shift+Enter breaks the line, IME composition is left alone
const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
    event.preventDefault()
    event.currentTarget.form?.requestSubmit()
  }
}

export const SendMessageForm = ({ chat }: { chat: Chat }) => {
  const sendMessage = useSendMessage()
  const form = useZodForm(sendMessageSchema)

  return (
    <Form
      form={form}
      resetOnSubmit
      onSubmit={({ text }) => {
        sendMessage.mutate({ chatId: chat.id, recipient: chat.phone ?? chat.id, text })
      }}
      className="flex items-end gap-2 border-t bg-background p-3"
    >
      <FormField
        name="text"
        label="Сообщение"
        hideLabel
        rootClassName="flex-1"
        render={
          <Textarea
            rows={1}
            placeholder="Сообщение"
            maxLength={MAX_MESSAGE_LENGTH}
            className="rounded-2xl"
            onKeyDown={submitOnEnter}
          />
        }
      />
      <FormSubmit
        requireValid

        size="icon"
        className="rounded-full"
        aria-label="Отправить"
      >
        <SendHorizontal />
      </FormSubmit>
    </Form>
  )
}
