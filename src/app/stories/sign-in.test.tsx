import { screen, waitFor } from '@testing-library/react'
import { delay, http, HttpResponse } from 'msw'

import { server, TEST_CREDENTIALS } from '@/shared/lib/test'

import { renderApp } from './render-app'

const stateInstance = (response: () => Response | Promise<Response>) => {
  server.use(http.get('*/getStateInstance/*', response))
}

const settings = (overrides: Record<string, string>) => {
  server.use(
    http.get('*/getSettings/*', () =>
      HttpResponse.json({
        webhookUrl: '',
        incomingWebhook: 'yes',
        outgoingWebhook: 'yes',
        outgoingAPIMessageWebhook: 'yes',
        ...overrides,
      }),
    ),
  )
}

describe('US-1: вход по данным GREEN-API', () => {
  it('TC-1.1: с корректными данными открывается экран чатов', async () => {
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(await screen.findByRole('heading', { name: 'Чаты' })).toBeInTheDocument()
    expect(screen.getByText(`Инстанс ${TEST_CREDENTIALS.idInstance}`)).toBeInTheDocument()
  })

  it('TC-1.2: пока поля пустые, кнопка «Войти» неактивна и запрос не отправляется', async () => {
    const requests: string[] = []
    server.events.on('request:start', ({ request }) => {
      requests.push(request.url)
    })
    const { user, fillSignIn } = renderApp()
    const submit = screen.getByRole('button', { name: 'Войти' })

    expect(submit).toBeDisabled()
    await fillSignIn({ apiUrl: TEST_CREDENTIALS.apiUrl, idInstance: TEST_CREDENTIALS.idInstance })
    expect(submit).toBeDisabled()
    await user.type(screen.getByLabelText('apiTokenInstance'), '   ')
    expect(submit).toBeDisabled()

    expect(requests).toEqual([])
    server.events.removeAllListeners()
  })

  it('TC-1.2b: неверный формат показывает ошибку под полем после отправки', async () => {
    const { user, fillSignIn } = renderApp()
    await fillSignIn({ ...TEST_CREDENTIALS, apiUrl: 'не ссылка' })
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Укажите apiUrl из личного кабинета')).toBeInTheDocument()
    expect(screen.getByLabelText('apiUrl')).toHaveAttribute('aria-invalid', 'true')
  })

  it.each(['http://api.green-api.com/v3', 'https://evil.example/green-api.com'])(
    'TC-1.14: apiUrl «%s» не принимается — токен уходит только в GREEN-API по HTTPS',
    async (apiUrl) => {
      const { user, fillSignIn } = renderApp()
      await fillSignIn({ ...TEST_CREDENTIALS, apiUrl })
      await user.click(screen.getByRole('button', { name: 'Войти' }))

      expect(await screen.findByText('Укажите apiUrl из личного кабинета')).toBeInTheDocument()
    },
  )

  it('TC-1.3: idInstance с буквами не принимается', async () => {
    const { user, fillSignIn } = renderApp()
    await fillSignIn({ ...TEST_CREDENTIALS, idInstance: '31abc' })
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('idInstance состоит только из цифр')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Чаты' })).not.toBeInTheDocument()
  })

  it('TC-1.4: слеш в конце apiUrl не ломает адрес запросов', async () => {
    const urls: string[] = []
    server.events.on('request:start', ({ request }) => {
      urls.push(request.url)
    })
    const { user, fillSignIn } = renderApp()
    await fillSignIn({ ...TEST_CREDENTIALS, apiUrl: `${TEST_CREDENTIALS.apiUrl}/` })
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByRole('heading', { name: 'Чаты' })).toBeInTheDocument()
    expect(urls.length).toBeGreaterThan(0)
    expect(urls.every((url) => url.startsWith(`${TEST_CREDENTIALS.apiUrl}/waInstance`))).toBe(true)
    server.events.removeAllListeners()
  })

  it('TC-1.5: неверный токен — уведомление, пользователь остаётся на входе', async () => {
    stateInstance(() => HttpResponse.json({}, { status: 401 }))
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Неверный idInstance или apiTokenInstance',
    )
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('TC-1.6: инстанс не авторизован в MAX — подсказка про QR-код', async () => {
    stateInstance(() => HttpResponse.json({ stateInstance: 'notAuthorized' }))
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(await screen.findByText('Инстанс не готов к работе')).toBeInTheDocument()
    expect(screen.getByText(/отсканируйте QR-код/)).toBeInTheDocument()
  })

  it('TC-1.7: задан webhookUrl — подсказка очистить его', async () => {
    settings({ webhookUrl: 'https://example.com/hook' })
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(await screen.findByText(/задан webhookUrl/)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Чаты' })).not.toBeInTheDocument()
  })

  it('TC-1.8: уведомления выключены — подсказка включить их', async () => {
    settings({ incomingWebhook: 'no' })
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(await screen.findByText(/Включите входящие уведомления/)).toBeInTheDocument()
  })

  it('TC-1.9: ошибка поля от сервера показывается под полем, без уведомления', async () => {
    stateInstance(() =>
      HttpResponse.json(
        { message: 'Validation failed', errors: { idInstance: 'Инстанс удалён' } },
        { status: 400 },
      ),
    )
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(await screen.findByText('Инстанс удалён')).toBeInTheDocument()
    expect(screen.getByLabelText('idInstance')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('TC-1.10: сервер недоступен — уведомление про соединение', async () => {
    stateInstance(() => HttpResponse.error())
    const { submitSignIn } = renderApp()
    await submitSignIn()

    // network errors are retried with backoff before the user is told
    expect(await screen.findByRole('alert', {}, { timeout: 5_000 })).toHaveTextContent(
      'Нет соединения с сервером GREEN-API',
    )
  })

  it('TC-1.11: неизвестная ошибка — «Произошла неизвестная серверная ошибка»', async () => {
    stateInstance(() => HttpResponse.json({}, { status: 418 }))
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Произошла неизвестная серверная ошибка',
    )
  })

  it('TC-1.12: пока идёт проверка, кнопка входа неактивна', async () => {
    stateInstance(async () => {
      await delay(100)
      return HttpResponse.json({ stateInstance: 'authorized' })
    })
    const { submitSignIn } = renderApp()
    await submitSignIn()

    expect(screen.getByRole('button', { name: /Войти/ })).toBeDisabled()
    expect(screen.getByRole('status', { name: 'Загрузка' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Чаты' })).toBeInTheDocument()
    })
  })

  it('TC-1.13: «Где взять данные» открывает подсказку', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: 'Где взять данные' }))

    expect(await screen.findByRole('dialog', { name: 'Где взять данные' })).toBeInTheDocument()
  })
})
