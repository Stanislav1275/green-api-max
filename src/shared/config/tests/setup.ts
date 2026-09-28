import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'

import { greenApiMock, server } from './server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  greenApiMock.reset()
  localStorage.clear()
})

afterAll(() => {
  server.close()
})
