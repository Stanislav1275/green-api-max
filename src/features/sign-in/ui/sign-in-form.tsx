import { credentialsSchema } from '@/entities/session'
import { useDemoMode } from '@/shared/lib/demo-mode'
import { useZodForm } from '@/shared/lib/form'
import { useTranslation } from '@/shared/lib/i18n'
import { Alert } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { Form, FormField, FormSubmit } from '@/shared/ui/form'

import { DEMO_CREDENTIALS } from '../model/demo-credentials'
import { InstanceNotReadyError, useSignIn } from '../model/use-sign-in'

const FIELD_CLASS = 'h-13 rounded-xl px-4 md:text-[17px]'

export const SignInForm = () => {
  const { t } = useTranslation()
  const signIn = useSignIn()
  const isDemo = useDemoMode()
  const form = useZodForm(credentialsSchema, {
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
          if (!(error instanceof InstanceNotReadyError)) {
            throw error
          }
        }
      }}
    >
      {isDemo ? (
        <Alert.Root
          role="note"
          className="flex items-center justify-between gap-3 rounded-lg py-2 pr-3 text-[13px]"
        >
          <span>{t('signIn.demo.description')}</span>
          <Button
            variant="link"
            size="inline"
            className="text-[13px]"
            onClick={() => {
              form.reset(DEMO_CREDENTIALS)
            }}
          >
            {t('signIn.demo.fill')}
          </Button>
        </Alert.Root>
      ) : null}

      <FormField
        name="apiUrl"
        label="apiUrl"
        hideLabel
        type="url"
        placeholder={t('signIn.apiUrlPlaceholder')}
        className={FIELD_CLASS}
        autoComplete="url"
      />
      <FormField
        name="idInstance"
        label="idInstance"
        hideLabel
        inputMode="numeric"
        placeholder={t('signIn.idInstancePlaceholder')}
        className={FIELD_CLASS}
        autoComplete="username"
      />
      <FormField
        name="apiTokenInstance"
        label="apiTokenInstance"
        hideLabel
        type="password"
        placeholder={t('signIn.apiTokenInstancePlaceholder')}
        className={FIELD_CLASS}
        autoComplete="current-password"
      />
      <p className="-mt-1 px-3 text-sm leading-snug text-subtle-foreground">{t('signIn.hint')}</p>

      {signIn.error instanceof InstanceNotReadyError ? (
        <Alert.Root variant="warning">
          <Alert.Title>{t('signIn.notReady')}</Alert.Title>
          <Alert.Description>
            <ul className="list-disc pl-4">
              {signIn.error.problems.map((problem) => (
                <li key={problem}>{t(`signIn.problems.${problem}`)}</li>
              ))}
            </ul>
          </Alert.Description>
        </Alert.Root>
      ) : null}

      <FormSubmit requireFilled size="lg" className="mt-3 w-full">
        {t('signIn.submit')}
      </FormSubmit>
    </Form>
  )
}
