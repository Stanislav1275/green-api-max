import { credentialsSchema } from '@/entities/session'
import { useZodForm } from '@/shared/lib/form'
import { Alert } from '@/shared/ui/alert'
import { Form, FormField, FormSubmit } from '@/shared/ui/form'

import { InstanceNotReadyError, useSignIn } from '../model/use-sign-in'
import type { InstanceProblem } from '../model/verify-instance'

const PROBLEM_TEXT: Record<InstanceProblem, string> = {
  notAuthorized: 'Инстанс не авторизован в MAX — отсканируйте QR-код в личном кабинете.',
  webhookUrlSet:
    'В настройках инстанса задан webhookUrl — очистите его, иначе HTTP API не получит уведомления.',
  notificationsDisabled:
    'Включите входящие уведомления и уведомления об отправке через API в настройках инстанса.',
}

export const SignInForm = () => {
  const signIn = useSignIn()
  const form = useZodForm(credentialsSchema, {
    // deploy-time prefill is a UI concern, so it is not baked into the entity schema
    defaultValues: { apiUrl: import.meta.env.VITE_DEFAULT_API_URL ?? '' },
  })

  return (
    <Form
      form={form}
      className="grid gap-3"
      onSubmit={async (credentials) => {
        try {
          await signIn.mutateAsync(credentials)
        } catch (error) {
          // shown inline below; anything else goes to field errors or a toast
          if (!(error instanceof InstanceNotReadyError)) {
            throw error
          }
        }
      }}
    >
      <FormField
        name="apiUrl"
        label="apiUrl"
        hideLabel
        type="url"
        placeholder="apiUrl — https://…api.green-api.com"
        autoComplete="url"
      />
      <FormField
        name="idInstance"
        label="idInstance"
        hideLabel
        inputMode="numeric"
        placeholder="idInstance"
        autoComplete="username"
      />
      <FormField
        name="apiTokenInstance"
        label="apiTokenInstance"
        hideLabel
        type="password"
        placeholder="apiTokenInstance"
        autoComplete="current-password"
      />
      <p className="-mt-1 px-4 text-[13px] leading-snug text-subtle-foreground">
        Данные инстанса есть в личном кабинете GREEN-API — нажмите «?», чтобы узнать где
      </p>

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
      ) : null}

      <FormSubmit size="lg" className="mt-3 w-full">
        Войти
      </FormSubmit>
    </Form>
  )
}
