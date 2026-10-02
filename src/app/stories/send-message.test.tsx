import { screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'

import { greenApiMock, server } from '@/shared/lib/test'

import { renderApp } from './render-app'

const PHONE = '79991234567'

const renderChat = async () => {
  greenApiMock.setAutoReply(false)
  const app = renderApp({ signedIn: true })
  await app.openChat(PHONE)
  return app
}

describe('US-3: отправка сообщения', () => {
  it('TC-3.1: Enter отправляет сообщение, поле очищается', async () => {
    const { send, messages } = await renderChat()
    await send('Привет')

    const list = await messages()
    const message = list.getByText('Привет').closest('li')
    expect(message).toHaveAttribute('data-direction', 'out')
    await waitFor(() => {
      expect(list.getByLabelText('Отправлено')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Сообщение')).toHaveValue('')
  })

  it('TC-3.2: Shift+Enter переносит строку и не отправляет', async () => {
    const { user } = await renderChat()
    const input = screen.getByLabelText('Сообщение')
    await user.type(input, 'Первая{Shift>}{Enter}{/Shift}вторая')

    expect(input).toHaveValue('Первая\nвторая')
    expect(greenApiMock.getSentMessages()).toEqual([])
  })

  it('TC-3.3: пустое сообщение или пробелы не отправляются', async () => {
    const { user } = await renderChat()
    const submit = screen.getByRole('button', { name: 'Отправить' })
    expect(submit).toBeDisabled()

    await user.type(screen.getByLabelText('Сообщение'), '   {Enter}')

    expect(submit).toBeDisabled()
    expect(greenApiMock.getSentMessages()).toEqual([])
  })

  it('TC-3.4: в GREEN-API уходит chatId телефона и текст без пробелов по краям', async () => {
    const { send } = await renderChat()
    await send('  текст  ')

    await waitFor(() => {
      expect(greenApiMock.getSentMessages()).toEqual([
        { chatId: `${PHONE}@c.us`, message: 'текст' },
      ])
    })
  })

  it('TC-3.5: ошибка сервера — статус «Не отправлено» и уведомление', async () => {
    server.use(http.post('*/sendMessage/*', () => HttpResponse.json({}, { status: 500 })))
    const { send, messages } = await renderChat()
    await send('Не дойдёт')

    expect(await (await messages()).findByLabelText('Не отправлено')).toBeInTheDocument()
    expect(await screen.findByRole('alert')).toHaveTextContent('Сервер GREEN-API недоступен')
  })

  it('TC-3.6: до ответа сервера статус «Отправляется»', async () => {
    server.use(
      http.post('*/sendMessage/*', async () => {
        await delay(150)
        return HttpResponse.json({ idMessage: '1' })
      }),
    )
    const { send, messages } = await renderChat()
    await send('Жду')

    const list = await messages()
    expect(list.getByLabelText('Отправляется')).toBeInTheDocument()
    expect(await list.findByLabelText('Отправлено')).toBeInTheDocument()
  })

  it('TC-3.7: длина сообщения ограничена 4000 символами', async () => {
    const { user } = await renderChat()
    const input = screen.getByLabelText('Сообщение')
    await user.click(input)
    await user.paste('я'.repeat(4001))

    expect(input).toHaveAttribute('maxlength', '4000')
    expect((input as HTMLTextAreaElement).value).toHaveLength(4000)
  })

  it('TC-3.8: кнопка «Отправить» работает как Enter', async () => {
    const { user, messages } = await renderChat()
    await user.type(screen.getByLabelText('Сообщение'), 'Кнопкой')
    await user.click(screen.getByRole('button', { name: 'Отправить' }))

    expect((await messages()).getByText('Кнопкой')).toBeInTheDocument()
    await waitFor(() => {
      expect(greenApiMock.getSentMessages()).toHaveLength(1)
    })
  })
})
