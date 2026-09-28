import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { type Credentials, type CredentialsInput, credentialsSchema } from '@/entities/session'
import { useFormResolver } from '@/shared/lib/form'
import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { FormField } from '@/shared/ui/form'
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

export const SignInForm = () => {
  const signIn = useSignIn()
  const form = useForm<CredentialsInput, unknown, Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      apiUrl: import.meta.env.VITE_DEFAULT_API_URL ?? '',
      idInstance: '',
      apiTokenInstance: '',
    },
  })
  const { resolveError } = useFormResolver(form)

  return (
    <form
      noValidate
      className="grid gap-4"
      onSubmit={(event) =>
        void form.handleSubmit((credentials) => {
          signIn.mutate(credentials, {
            onError: (error) => {
              if (!(error instanceof InstanceNotReadyError)) {
                void resolveError(error)
              }
            },
          })
        })(event)
      }
    >
      <FormField
        control={form.control}
        name="apiUrl"
        label="apiUrl"
        type="url"
        placeholder="https://3100.api.green-api.com/v3"
        autoComplete="url"
      />
      <FormField
        control={form.control}
        name="idInstance"
        label="idInstance"
        inputMode="numeric"
        placeholder="3100000001"
        autoComplete="username"
      />
      <FormField
        control={form.control}
        name="apiTokenInstance"
        label="apiTokenInstance"
        type="password"
        autoComplete="current-password"
      />

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

      <Button type="submit" size="lg" disabled={signIn.isPending}>
        {signIn.isPending ? <Spinner /> : null}
        Войти
      </Button>
    </form>
  )
}
