import { useEffect } from 'react'

import { parseNotification, useChatStore } from '@/entities/chat'
import { useCredentials } from '@/entities/session'
import { createGreenApi } from '@/shared/api'

import { pollNotifications } from './poll-notifications'

export const useReceiveMessages = () => {
  const credentials = useCredentials()
  const applyEvent = useChatStore((state) => state.applyEvent)

  useEffect(() => {
    if (!credentials) {
      return
    }
    const controller = new AbortController()
    void pollNotifications({
      api: createGreenApi(credentials),
      signal: controller.signal,
      onNotification: (body) => {
        const event = parseNotification(body)
        if (event) {
          applyEvent(event)
        }
      },
      onError: (error) => {
        console.warn('receiveNotification failed, retrying', error)
      },
    })
    return () => {
      controller.abort()
    }
  }, [credentials, applyEvent])
}
