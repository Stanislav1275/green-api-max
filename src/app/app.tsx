import { useCredentials } from '@/entities/session'
import { SignInPage } from '@/pages/sign-in'

import { QueryProvider } from './query/query-provider'

const Screen = () => {
  const credentials = useCredentials()
  return credentials ? <p className="p-6">Чаты скоро будут здесь</p> : <SignInPage />
}

export const App = () => (
  <QueryProvider>
    <Screen />
  </QueryProvider>
)
