import { screen, waitFor } from '@testing-library/react'

import { server, TEST_CREDENTIALS } from '@/shared/lib/test'

import { reloadStores, renderApp } from './render-app'

describe('US-5: сессия и выход', () => {
  it('TC-5.1: после перезагрузки пользователь остаётся в чатах с историей', async () => {
    const first = renderApp()
    await first.submitSignIn()
    await first.openChat('79991234567')
    await first.send('Сохранится')
    await (await first.messages()).findByText('Эхо: Сохранится')
    first.view.unmount()

    await reloadStores()
    const { user, chatList, messages } = renderApp()

    expect(screen.getByText(`Инстанс ${TEST_CREDENTIALS.idInstance}`)).toBeInTheDocument()
    await user.click(chatList().getByRole('button', { name: /\+7 999 123-45-67/ }))
    expect((await messages()).getByText('Сохранится')).toBeInTheDocument()
  })

  it('TC-5.2: выход очищает данные и останавливает опрос сервера', async () => {
    const { user, openChat } = renderApp({ signedIn: true })
    await openChat('79991234567')

    await user.click(screen.getByRole('button', { name: 'Выйти' }))

    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('green-api-max/session') ?? '{}')).toMatchObject({
      state: { credentials: null },
    })
    expect(JSON.parse(localStorage.getItem('green-api-max/chats') ?? '{}')).toMatchObject({
      state: { chats: {} },
    })

    let polls = 0
    server.events.on('request:start', () => {
      polls += 1
    })
    await new Promise((resolve) => setTimeout(resolve, 150))
    await waitFor(() => {
      expect(polls).toBe(0)
    })
    server.events.removeAllListeners()
  })
})
