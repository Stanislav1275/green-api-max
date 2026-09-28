import { screen } from '@testing-library/react'

import { renderApp } from './render-app'

describe('US-6: мобильная версия', () => {
  it('TC-6.1: «Назад к чатам» закрывает переписку и возвращает список', async () => {
    const { user, openChat } = renderApp({ signedIn: true })
    await openChat('79991234567')
    expect(screen.getByRole('region', { name: 'Чат: +7 999 123-45-67' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Назад к чатам' }))

    expect(screen.queryByRole('region', { name: /Чат:/ })).not.toBeInTheDocument()
    expect(screen.getByText('Выберите чат или создайте новый')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Список чатов' })).toBeInTheDocument()
  })
})
