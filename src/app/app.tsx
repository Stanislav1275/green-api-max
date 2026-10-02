import { CSPProvider } from '@base-ui/react/csp-provider'
import { LucideProvider } from 'lucide-react'

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
  <CSPProvider disableStyleElements>
    <LucideProvider size={20} className="shrink-0">
      <ToastProvider>
        <QueryProvider>
          <Screen />
        </QueryProvider>
      </ToastProvider>
    </LucideProvider>
  </CSPProvider>
)
