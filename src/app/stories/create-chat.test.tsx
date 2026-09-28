import { screen } from '@testing-library/react'

import { renderApp } from './render-app'

describe('US-2: новый чат по номеру телефона', () => {
  it.each(['+7 (999) 123-45-67', '8 999 123 45 67', '9991234567'])(
    'TC-2.1: номер «%s» открывает чат +7 999 123-45-67',
    async (phone) => {
      const { openChat } = renderApp({ signedIn: true })
      await openChat(phone)

      expect(
        await screen.findByRole('heading', { level: 2, name: '+7 999 123-45-67' }),
      ).toBeInTheDocument()
      expect(screen.getByLabelText('Номер телефона получателя')).toHaveValue('')
    },
  )

  it.each(['12345', 'abc'])('TC-2.2: «%s» — ошибка, чат не создан', async (phone) => {
    const { openChat } = renderApp({ signedIn: true })
    await openChat(phone)

    expect(await screen.findByText('Введите номер в формате +7 999 123-45-67')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Список чатов' })).not.toBeInTheDocument()
  })

  it('TC-2.3: повторный ввод номера открывает существующий чат без дубля', async () => {
    const { openChat, chatList } = renderApp({ signedIn: true })
    await openChat('+79991234567')
    await openChat('89991234567')

    expect(chatList().getAllByRole('button')).toHaveLength(1)
  })

  it('TC-2.4: при первом входе вместо списка подсказка', () => {
    renderApp({ signedIn: true })

    expect(screen.getByText('Введите номер получателя, чтобы начать переписку')).toBeInTheDocument()
    expect(screen.getByText('Выберите чат или создайте новый')).toBeInTheDocument()
  })

  it('TC-2.5: выбор чата в списке открывает его и отмечает активным', async () => {
    const { user, openChat, chatList } = renderApp({ signedIn: true })
    await openChat('79991234567')
    await openChat('79997654321')

    await user.click(chatList().getByRole('button', { name: /\+7 999 123-45-67/ }))

    expect(screen.getByRole('heading', { level: 2, name: '+7 999 123-45-67' })).toBeInTheDocument()
    expect(chatList().getByRole('button', { name: /\+7 999 123-45-67/ })).toHaveAttribute(
      'aria-current',
      'true',
    )
    expect(chatList().getByRole('button', { name: /\+7 999 765-43-21/ })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
