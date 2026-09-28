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
  // 20px is the default icon size; `size` on an icon still overrides it
  <LucideProvider size={20} className="shrink-0">
    <ToastProvider>
      <QueryProvider>
        <Screen />
      </QueryProvider>
    </ToastProvider>
  </LucideProvider>
)
