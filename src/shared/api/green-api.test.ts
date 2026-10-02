import { http, HttpResponse } from 'msw'

import { greenApiMock, server, TEST_CREDENTIALS } from '@/shared/lib/test'

import { createGreenApi, REQUEST_TIMEOUT_MS } from './green-api'

const api = createGreenApi(TEST_CREDENTIALS)

describe('createGreenApi', () => {
  it('puts idInstance and token into the url path', async () => {
    await expect(api.getStateInstance()).resolves.toEqual({ stateInstance: 'authorized' })
  })

  it('tolerates a trailing slash in apiUrl', async () => {
    const withSlash = createGreenApi({ ...TEST_CREDENTIALS, apiUrl: 'https://api.test/' })
    await expect(withSlash.getSettings()).resolves.toMatchObject({ webhookUrl: '' })
  })

  it('returns null when the notification queue is empty', async () => {
    await expect(api.receiveNotification()).resolves.toBeNull()
  })

  it('receives and deletes a notification', async () => {
    greenApiMock.replyFrom({ phone: '79991234567', text: 'Привет' })

    const notification = await api.receiveNotification()
    expect(notification?.body.messageData?.textMessageData?.textMessage).toBe('Привет')

    await expect(api.deleteNotification(notification?.receiptId ?? -1)).resolves.toEqual({
      result: true,
    })
    await expect(api.receiveNotification()).resolves.toBeNull()
  })

  it('sends a message and gets its id back', async () => {
    const { idMessage } = await api.sendMessage({ chatId: '79991234567@c.us', message: 'hi' })
    expect(idMessage).toMatch(/^\d+$/)
  })
})

describe('resilience', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('cuts a hanging request off after 30 s with a TimeoutError', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const timeout = vi.spyOn(AbortSignal, 'timeout').mockImplementation(() => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort(new DOMException('The operation timed out.', 'TimeoutError'))
      }, REQUEST_TIMEOUT_MS)
      return controller.signal
    })
    server.use(http.post('*/sendMessage/*', () => new Promise<never>(() => undefined)))

    const request = api.sendMessage({ chatId: '79991234567@c.us', message: 'hi' })
    const assertion = expect(request).rejects.toMatchObject({ name: 'TimeoutError' })
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS)

    await assertion
    expect(timeout).toHaveBeenCalledWith(REQUEST_TIMEOUT_MS)
  })

  it('retries idempotent requests on 5xx and succeeds', async () => {
    let calls = 0
    server.use(
      http.get('*/getStateInstance/*', () => {
        calls += 1
        return calls < 3
          ? HttpResponse.json({}, { status: 503 })
          : HttpResponse.json({ stateInstance: 'authorized' })
      }),
    )

    await expect(api.getStateInstance()).resolves.toEqual({ stateInstance: 'authorized' })
    expect(calls).toBe(3)
  })

  it('does not retry client errors', async () => {
    let calls = 0
    server.use(
      http.delete('*/deleteNotification/*', () => {
        calls += 1
        return HttpResponse.json({}, { status: 400 })
      }),
    )

    await expect(api.deleteNotification(1)).rejects.toMatchObject({ status: 400 })
    expect(calls).toBe(1)
  })

  it('never retries sendMessage, so a message is not delivered twice', async () => {
    let calls = 0
    server.use(
      http.post('*/sendMessage/*', () => {
        calls += 1
        return HttpResponse.json({}, { status: 503 })
      }),
    )

    await expect(api.sendMessage({ chatId: '1@c.us', message: 'hi' })).rejects.toMatchObject({
      status: 503,
    })
    expect(calls).toBe(1)
  })

  it('stops retrying when the caller aborts', async () => {
    server.use(http.get('*/getSettings/*', () => HttpResponse.error()))
    const controller = new AbortController()

    const request = api.getSettings(controller.signal)
    controller.abort()

    await expect(request).rejects.toBeDefined()
  })
})
