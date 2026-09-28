import { screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import type { NotificationBody } from '@/shared/api'
import { greenApiMock, server } from '@/shared/lib/test'
import { toMaxChatId } from '@/shared/mocks'

import { renderApp } from './render-app'

const PHONE = '79991234567'

describe('US-4: получение ответа', () => {
  it('TC-4.1: ответ с числовым chatId MAX попадает в чат, созданный по номеру', async () => {
    const { openChat, send, messages, chatList } = renderApp({ signedIn: true })
    await openChat(PHONE)
    await send('Привет')

    const list = await messages()
    const reply = await list.findByText('Эхо: Привет')
    expect(reply.closest('li')).toHaveAttribute('data-direction', 'in')
    // the reply joins the history instead of replacing the chat
    expect(list.getByText('Привет').closest('li')).toHaveAttribute('data-direction', 'out')
    expect(list.getAllByRole('listitem')).toHaveLength(2)
    expect(chatList().getAllByRole('button')).toHaveLength(1)
  })

  it('TC-4.2: сообщение от нового контакта создаёт чат с его именем', async () => {
    const { user, chatList } = renderApp({ signedIn: true })
    greenApiMock.replyFrom({ phone: '79875554433', text: 'Добрый день', name: 'Анна' })

    const chat = await screen.findByRole('button', { name: /Анна/ })
    expect(chat).toHaveTextContent('Добрый день')
    expect(chatList().getAllByRole('button')).toHaveLength(1)

    await user.click(chat)
    expect(screen.getByRole('heading', { level: 2, name: 'Анна' })).toBeInTheDocument()
    expect(screen.getByText('+7 987 555-44-33')).toBeInTheDocument()
  })

  it('TC-4.3: неподдерживаемые и битые уведомления пропускаются и удаляются из очереди', async () => {
    renderApp({ signedIn: true })
    greenApiMock.enqueue({ typeWebhook: 'stateInstanceChanged', timestamp: 1 })
    greenApiMock.enqueue({
      typeWebhook: 'incomingMessageReceived',
      timestamp: 1,
      idMessage: 'img',
      senderData: { chatId: toMaxChatId(PHONE), sender: toMaxChatId(PHONE) },
      messageData: { typeMessage: 'imageMessage' },
    })
    greenApiMock.enqueue({ typeWebhook: 'incomingMessageReceived' } as unknown as NotificationBody)
    greenApiMock.replyFrom({ phone: PHONE, text: 'Дошло' })

    expect(await screen.findByRole('button', { name: /Дошло/ })).toBeInTheDocument()
    await waitFor(() => {
      expect(greenApiMock.getQueueSize()).toBe(0)
    })
    expect(screen.getAllByRole('button', { name: /\+7 999 123-45-67/ })).toHaveLength(1)
  })

  it('TC-4.4: своё отправленное сообщение не дублируется уведомлением', async () => {
    greenApiMock.setAutoReply(false)
    const { openChat, send, messages } = renderApp({ signedIn: true })
    await openChat(PHONE)
    await send('Один раз')

    // the mock echoes every send back as outgoingAPIMessageReceived
    await waitFor(() => {
      expect(greenApiMock.getQueueSize()).toBe(0)
    })
    expect((await messages()).getAllByText('Один раз')).toHaveLength(1)
  })

  it('TC-4.5: сообщение, написанное с телефона, показывается как исходящее', async () => {
    const { openChat, send, messages } = renderApp({ signedIn: true })
    await openChat(PHONE)
    await send('Привет')
    await (await messages()).findByText('Эхо: Привет')

    greenApiMock.outgoingFromPhone({ phone: PHONE, text: 'С телефона' })

    const message = await (await messages()).findByText('С телефона')
    expect(message.closest('li')).toHaveAttribute('data-direction', 'out')
  })

  it('TC-4.8: ответ в чат, где известен только MAX chatId, уходит на этот chatId', async () => {
    greenApiMock.setAutoReply(false)
    const { user, send } = renderApp({ signedIn: true })
    greenApiMock.outgoingFromPhone({ phone: PHONE, text: 'С телефона' })

    const chatId = toMaxChatId(PHONE)
    await user.click(await screen.findByRole('button', { name: new RegExp(`Чат ${chatId}`) }))
    expect(screen.getByRole('heading', { level: 2, name: `Чат ${chatId}` })).toBeInTheDocument()
    await send('Ответ')

    await waitFor(() => {
      expect(greenApiMock.getSentMessages()).toEqual([{ chatId, message: 'Ответ' }])
    })
  })

  it('TC-4.6: после сбоя получения приложение повторяет запрос', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    server.use(http.get('*/receiveNotification/*', () => HttpResponse.error(), { once: true }))
    renderApp({ signedIn: true })
    greenApiMock.replyFrom({ phone: PHONE, text: 'После сбоя' })

    await vi.advanceTimersByTimeAsync(2_500)

    expect(await screen.findByRole('button', { name: /После сбоя/ })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('TC-4.7: чат с новым сообщением поднимается наверх списка', async () => {
    // GREEN-API timestamps have second precision, so move the clock between the steps
    vi.useFakeTimers({ shouldAdvanceTime: true, toFake: ['Date'] })
    const { openChat, chatList } = renderApp({ signedIn: true })
    await openChat(PHONE)
    vi.setSystemTime(Date.now() + 2_000)
    await openChat('79997654321')
    expect(chatList().getAllByRole('button')[0]).toHaveTextContent('+7 999 765-43-21')

    vi.setSystemTime(Date.now() + 2_000)
    greenApiMock.replyFrom({ phone: PHONE, text: 'Я выше' })

    await waitFor(() => {
      expect(chatList().getAllByRole('button')[0]).toHaveTextContent('Я выше')
    })
    expect(
      within(chatList().getAllByRole('button')[0]!).getByText('+7 999 123-45-67'),
    ).toBeInTheDocument()
    vi.useRealTimers()
  })
})
