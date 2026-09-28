import { useCredentials } from '@/entities/session'
import { MessengerPage } from '@/pages/messenger'
import { SignInPage } from '@/pages/sign-in'
import { ToastProvider } from '@/shared/ui/toast'

import { QueryProvider } from './query/query-provider'

const Screen = () => {
  const credentials = useCredentials()
  return credentials ? <MessengerPage /> : <SignInPage />
}

export const App = () => (
  <ToastProvider>
    <QueryProvider>
      <Screen />
    </QueryProvider>
  </ToastProvider>
)
