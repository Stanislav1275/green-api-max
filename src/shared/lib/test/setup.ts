import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'

import { greenApiMock, server } from './server'

// jsdom has no layout engine
Element.prototype.scrollTo = () => undefined

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
