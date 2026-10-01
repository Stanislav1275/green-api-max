import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import type * as Zustand from 'zustand'

import { i18n } from '@/shared/lib/i18n'

import { greenApiMock, server } from './server'

const storeResets = vi.hoisted(() => new Set<() => void>())

vi.mock('zustand', async (importOriginal) => {
  const zustand = await importOriginal<typeof Zustand>()
  const createTracked = (<T>(initializer: Zustand.StateCreator<T>) => {
    const store = zustand.create(initializer)
    const initialState = store.getInitialState()
    storeResets.add(() => {
      store.setState(initialState, true)
    })
    return store
  }) as typeof zustand.create
  const create = (<T>(initializer?: Zustand.StateCreator<T>) =>
    initializer ? createTracked(initializer) : createTracked) as typeof zustand.create
  return { ...zustand, create }
})

Element.prototype.scrollTo = () => undefined

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  greenApiMock.reset()
  localStorage.clear()
  storeResets.forEach((reset) => {
    reset()
  })
  void i18n.changeLanguage('ru')
})

afterAll(() => {
  server.close()
})
