import { renderHook } from '@testing-library/react'

import { server } from '@/shared/lib/test'

import { useReceiveMessages } from './use-receive-messages'

it('does not poll without a session', async () => {
  const requests: string[] = []
  server.events.on('request:start', ({ request }) => {
    requests.push(request.url)
  })

  renderHook(() => {
    useReceiveMessages()
  })
  await new Promise((resolve) => setTimeout(resolve, 50))

  expect(requests).toEqual([])
  server.events.removeAllListeners()
})
