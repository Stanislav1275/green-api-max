import { createGreenApi } from '@/shared/api'

import { useCredentials } from '../model/session-store'

export const useGreenApi = () => {
  const credentials = useCredentials()
  if (!credentials) {
    throw new Error('useGreenApi requires an active session')
  }
  return createGreenApi(credentials)
}
