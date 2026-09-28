import { MessageSquarePlus } from 'lucide-react'

import { useChatStore } from '@/entities/chat'
import { useZodForm } from '@/shared/lib/form'
import { Form, FormField, FormSubmit } from '@/shared/ui/form'

import { createChatSchema } from '../model/create-chat-schema'

export const CreateChatForm = () => {
  const openChat = useChatStore((state) => state.openChat)
  const form = useZodForm(createChatSchema)

  return (
    <Form
      form={form}
      resetOnSubmit
      onSubmit={({ phone }) => {
        openChat(phone)
      }}
      className="flex items-start gap-2"
    >
      <FormField
        name="phone"
        label="Номер телефона получателя"
        hideLabel
        rootClassName="flex-1"
        type="tel"
        inputMode="tel"
        placeholder="Номер телефона"
        autoComplete="tel"
      />
      <FormSubmit size="icon" variant="secondary" aria-label="Создать чат">
        <MessageSquarePlus />
      </FormSubmit>
    </Form>
  )
}
