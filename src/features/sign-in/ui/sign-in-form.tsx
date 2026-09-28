import { useState } from 'react'
import * as z from 'zod'

import { credentialsSchema } from '@/entities/session'
import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Field } from '@/shared/ui/field'
import { Form } from '@/shared/ui/form'
import { Spinner } from '@/shared/ui/spinner'

import { InstanceNotReadyError, useSignIn } from '../model/use-sign-in'
import type { InstanceProblem } from '../model/verify-instance'

const PROBLEM_TEXT: Record<InstanceProblem, string> = {
  notAuthorized: 'Инстанс не авторизован в MAX — отсканируйте QR-код в личном кабинете.',
  webhookUrlSet:
    'В настройках инстанса задан webhookUrl — очистите его, иначе HTTP API не получит уведомления.',
  notificationsDisabled:
    'Включите входящие уведомления и уведомления об отправке через API в настройках инстанса.',
}

const DEFAULT_API_URL = import.meta.env.VITE_DEFAULT_API_URL ?? ''

export const SignInForm = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const signIn = useSignIn()

  const handleSubmit = (values: Record<string, unknown>) => {
    const parsed = credentialsSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors)
      return
    }
    setErrors({})
    signIn.mutate(parsed.data)
  }

  return (
    <Form errors={errors} onFormSubmit={handleSubmit} noValidate>
      <Field.Root name="apiUrl">
        <Field.Label>apiUrl</Field.Label>
        <Field.Control
          type="url"
          defaultValue={DEFAULT_API_URL}
          placeholder="https://3100.api.green-api.com/v3"
          autoComplete="url"
        />
        <Field.Error />
      </Field.Root>

      <Field.Root name="idInstance">
        <Field.Label>idInstance</Field.Label>
        <Field.Control inputMode="numeric" placeholder="3100000001" autoComplete="username" />
        <Field.Error />
      </Field.Root>

      <Field.Root name="apiTokenInstance">
        <Field.Label>apiTokenInstance</Field.Label>
        <Field.Control type="password" autoComplete="current-password" />
        <Field.Error />
      </Field.Root>

      {signIn.error instanceof InstanceNotReadyError ? (
        <Alert.Root variant="warning">
          <Alert.Title>Инстанс не готов к работе</Alert.Title>
          <Alert.Description>
            <ul className="list-disc pl-4">
              {signIn.error.problems.map((problem) => (
                <li key={problem}>{PROBLEM_TEXT[problem]}</li>
              ))}
            </ul>
          </Alert.Description>
        </Alert.Root>
      ) : signIn.error ? (
        <Alert.Root variant="destructive">
          <Alert.Title>Не удалось подключиться</Alert.Title>
          <Alert.Description>Проверьте apiUrl, idInstance и apiTokenInstance.</Alert.Description>
        </Alert.Root>
      ) : null}

      <Button type="submit" size="lg" disabled={signIn.isPending}>
        {signIn.isPending ? <Spinner /> : null}
        Войти
      </Button>
    </Form>
  )
}
