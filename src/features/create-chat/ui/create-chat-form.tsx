import { MessageSquarePlus } from 'lucide-react'
import { useRef, useState } from 'react'

import { useChatStore } from '@/entities/chat'
import { normalizePhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'

const FIELD = 'phone'

export const CreateChatForm = () => {
  const openChat = useChatStore((state) => state.openChat)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <Form
      ref={formRef}
      errors={errors}
      noValidate
      className="flex items-start gap-2"
      onFormSubmit={(values) => {
        const phone = normalizePhone(String(values[FIELD] ?? ''))
        if (!phone) {
          setErrors({ [FIELD]: 'Введите номер в формате +7 999 123-45-67' })
          return
        }
        setErrors({})
        openChat(phone)
        formRef.current?.reset()
      }}
    >
      <Field.Root name={FIELD} className="flex-1">
        <Field.Label className="sr-only">Номер телефона получателя</Field.Label>
        <Field.Control type="tel" inputMode="tel" placeholder="Номер телефона" autoComplete="tel" />
        <Field.Error />
      </Field.Root>
      <Button type="submit" size="icon" variant="secondary" aria-label="Создать чат">
        <MessageSquarePlus />
      </Button>
    </Form>
  )
}
