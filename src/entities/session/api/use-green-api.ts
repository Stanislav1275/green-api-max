import { createGreenApi } from '@/shared/api'

import { useCredentials } from '../model/session-store'

/** GREEN-API client bound to the signed-in instance. Use only under an authenticated screen. */
export const useGreenApi = () => {
  const credentials = useCredentials()
  if (!credentials) {
    throw new Error('useGreenApi requires an active session')
  }
  return createGreenApi(credentials)
}
