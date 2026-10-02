import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { TEST_CREDENTIALS } from '@/shared/lib/test'

import { App } from '../app'

type RenderAppOptions = {
  /** start on the messenger screen, as a returning user */
  signedIn?: boolean
}

/** Renders the whole app the way a user sees it; GREEN-API is served by the MSW mock. */
export const renderApp = ({ signedIn = false }: RenderAppOptions = {}) => {
  if (signedIn) {
    useSessionStore.getState().signIn(TEST_CREDENTIALS)
  }
  const user = userEvent.setup()
  const view = render(<App />)

  const fillSignIn = async (credentials: Partial<typeof TEST_CREDENTIALS> = TEST_CREDENTIALS) => {
    for (const [label, value] of Object.entries(credentials)) {
      await user.type(screen.getByLabelText(label), value)
    }
  }

  const submitSignIn = async () => {
    await fillSignIn()
    await user.click(screen.getByRole('button', { name: 'Войти' }))
  }

  const openChat = async (phone: string) => {
    await user.type(await screen.findByLabelText('Номер телефона получателя'), phone)
    await user.click(screen.getByRole('button', { name: 'Создать чат' }))
  }

  const send = async (text: string) => {
    await user.type(screen.getByLabelText('Сообщение'), `${text}{Enter}`)
  }

  const chatList = () => within(screen.getByRole('navigation', { name: 'Список чатов' }))

  const messages = async () => within(await screen.findByRole('list', { name: 'Сообщения' }))

  return { user, view, fillSignIn, submitSignIn, openChat, send, chatList, messages }
}

/** Simulates a page reload: persisted stores re-read localStorage. */
export const reloadStores = async () => {
  await useSessionStore.persist.rehydrate()
  await useChatStore.persist.rehydrate()
}
