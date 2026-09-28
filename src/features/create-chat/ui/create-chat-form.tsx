import { zodResolver } from '@hookform/resolvers/zod'
import { MessageSquarePlus } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { useChatStore } from '@/entities/chat'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form'

import {
  type CreateChatInput,
  createChatSchema,
  type CreateChatValues,
} from '../model/create-chat-schema'

export const CreateChatForm = () => {
  const openChat = useChatStore((state) => state.openChat)
  const { control, handleSubmit, reset } = useForm<CreateChatInput, unknown, CreateChatValues>({
    resolver: zodResolver(createChatSchema),
    defaultValues: { phone: '' },
  })

  return (
    <form
      noValidate
      className="flex items-start gap-2"
      onSubmit={(event) =>
        void handleSubmit(({ phone }) => {
          openChat(phone)
          reset()
        })(event)
      }
    >
      <FormField
        control={control}
        name="phone"
        label="Номер телефона получателя"
        hideLabel
        rootClassName="flex-1"
        type="tel"
        inputMode="tel"
        placeholder="Номер телефона"
        autoComplete="tel"
      />
      <Button type="submit" size="icon" variant="secondary" aria-label="Создать чат">
        <MessageSquarePlus />
      </Button>
    </form>
  )
}
