import { MessageSquarePlus } from 'lucide-react'

import { useChatStore } from '@/entities/chat'
import { useZodForm } from '@/shared/lib/form'
import { useTranslation } from '@/shared/lib/i18n'
import { Form, FormField, FormSubmit } from '@/shared/ui/form'
import { PhoneInput } from '@/shared/ui/phone-input'

import { createChatSchema } from '../model/create-chat-schema'

export const CreateChatForm = () => {
  const { t } = useTranslation()
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
        label={t('createChat.phoneLabel')}
        hideLabel
        rootClassName="min-w-0 flex-1"
        renderControl={(field) => (
          <PhoneInput
            ref={field.ref}
            name={field.name}
            value={field.value as string}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      <FormSubmit size="icon" className="size-12 rounded-lg" aria-label={t('createChat.submit')}>
        <MessageSquarePlus />
      </FormSubmit>
    </Form>
  )
}
