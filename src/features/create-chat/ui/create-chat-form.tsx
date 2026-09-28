import { MessageSquarePlus } from 'lucide-react'

import { useChatStore } from '@/entities/chat'
import { useZodForm } from '@/shared/lib/form'
import { Form, FormField, FormSubmit } from '@/shared/ui/form'
import { PhoneInput } from '@/shared/ui/phone-input'

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
        rootClassName="min-w-0 flex-1"
        renderControl={(field) => (
          <PhoneInput
            ref={field.ref}
            name={field.name}
            value={(field.value as string | undefined) ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      <FormSubmit size="icon" className="size-12 rounded-lg" aria-label="Создать чат">
        <MessageSquarePlus />
      </FormSubmit>
    </Form>
  )
}
