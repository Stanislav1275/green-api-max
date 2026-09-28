import { SendHorizontal } from 'lucide-react'

import type { Chat } from '@/entities/chat'
import { useZodForm } from '@/shared/lib/form'
import { useHotKey } from '@/shared/lib/hotkey'
import { Form, FormField, FormSubmit } from '@/shared/ui/form'
import { Textarea } from '@/shared/ui/textarea'

import { MAX_MESSAGE_LENGTH, sendMessageSchema } from '../model/send-message-schema'
import { useSendMessage } from '../model/use-send-message'

export const SendMessageForm = ({ chat }: { chat: Chat }) => {
  const { send } = useSendMessage()
  const form = useZodForm(sendMessageSchema)
  // Enter sends; Shift+Enter is not matched and keeps inserting a line break
  const handleKeyDown = useHotKey<HTMLFormElement>([
    [
      'Enter',
      (event) => {
        event.currentTarget.requestSubmit()
      },
    ],
  ])

  return (
    <Form
      form={form}
      resetOnSubmit
      onSubmit={({ text }) => {
        send(chat, text)
      }}
      onKeyDown={handleKeyDown}
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
          />
        }
      />
      <FormSubmit requireValid size="icon" className="rounded-full" aria-label="Отправить">
        <SendHorizontal />
      </FormSubmit>
    </Form>
  )
}
