import { SignInForm } from '@/features/sign-in'
import { Card } from '@/shared/ui/card'

export const SignInPage = () => (
  <main className="grid min-h-full place-items-center bg-chat-background p-4">
    <Card.Root className="w-full max-w-sm">
      <Card.Header>
        <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-400 via-primary to-fuchsia-500 text-xl font-bold text-white">
          M
        </div>
        <Card.Title>Вход в чат</Card.Title>
        <Card.Description>
          Данные инстанса из{' '}
          <a
            href="https://console.green-api.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary underline-offset-4 hover:underline"
          >
            личного кабинета GREEN-API
          </a>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <SignInForm />
      </Card.Content>
    </Card.Root>
  </main>
)
