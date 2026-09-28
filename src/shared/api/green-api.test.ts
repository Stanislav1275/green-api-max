import { greenApiMock, TEST_CREDENTIALS } from '@/shared/config/tests'

import { createGreenApi } from './green-api'

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
    await expect(api.receiveNotification(5)).resolves.toBeNull()
  })

  it('receives and deletes a notification', async () => {
    greenApiMock.replyFrom('79991234567', 'Привет')

    const notification = await api.receiveNotification(5)
    expect(notification?.body.messageData?.textMessageData?.textMessage).toBe('Привет')

    await expect(api.deleteNotification(notification?.receiptId ?? -1)).resolves.toEqual({
      result: true,
    })
    await expect(api.receiveNotification(5)).resolves.toBeNull()
  })

  it('sends a message and gets its id back', async () => {
    const { idMessage } = await api.sendMessage({ chatId: '79991234567@c.us', message: 'hi' })
    expect(idMessage).toMatch(/^\d+$/)
  })
})
