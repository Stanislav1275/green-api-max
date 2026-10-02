import { renderHook } from '@testing-library/react'

import { TEST_CREDENTIALS } from '@/shared/lib/test'

import { useSessionStore } from '../model/session-store'
import { useGreenApi } from './use-green-api'

describe('useGreenApi', () => {
  it('throws outside an authenticated screen', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => renderHook(() => useGreenApi())).toThrow('useGreenApi requires an active session')
  })

  it('returns a client bound to the session', async () => {
    useSessionStore.getState().signIn(TEST_CREDENTIALS)
    const { result } = renderHook(() => useGreenApi())

    await expect(result.current.getStateInstance()).resolves.toEqual({
      stateInstance: 'authorized',
    })
  })
})
