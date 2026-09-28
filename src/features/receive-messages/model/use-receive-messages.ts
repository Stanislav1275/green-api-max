import { useEffect } from 'react'

import { parseNotification, useChatStore } from '@/entities/chat'
import { useCredentials } from '@/entities/session'
import { createGreenApi } from '@/shared/api'

import { pollNotifications } from './poll-notifications'

/** Keeps a single long-polling loop alive while the user is signed in. */
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
    // aborting also cancels the hanging request, so StrictMode's double effect never runs two loops
    return () => {
      controller.abort()
    }
  }, [credentials, applyEvent])
}
