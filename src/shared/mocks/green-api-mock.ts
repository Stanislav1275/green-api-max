import { faker } from '@faker-js/faker'
import { delay, http, HttpResponse } from 'msw'

import {
  createNotificationBody,
  createSenderData,
  createSettings,
  createStateInstance,
} from '@/shared/api/gen/mocks'
import type { Notification, NotificationBody } from '@/shared/api/gen/types'
import { sendMessageRequestSchema } from '@/shared/api/gen/zod'

const INSTANCE = '*/waInstance:idInstance'
type GreenApiMockOptions = {
  /** how long an empty long-poll hangs before returning `null` */
  emptyQueueDelayMs?: number
  /** how long the fake contact "types" the echo reply */
  replyDelayMs?: number
}

// MAX addresses a private chat by a numeric id, not by `phone@c.us`
const toMaxChatId = (phone: string) => String(Number(phone.slice(-8)) + 10_000_000)

/**
 * In-memory GREEN-API: keeps a FIFO notification queue and answers every
 * outgoing message with an incoming echo, the way a real MAX contact would.
 */
export const createGreenApiMock = ({
  emptyQueueDelayMs = 1_000,
  replyDelayMs = 1_500,
}: GreenApiMockOptions = {}) => {
  let lastReceiptId = 0
  let queue: Notification[] = []

  const enqueue = (body: NotificationBody) => {
    lastReceiptId += 1
    queue.push({ receiptId: lastReceiptId, body })
  }

  const replyFrom = (phone: string, text: string) => {
    const chatId = toMaxChatId(phone)
    enqueue(
      createNotificationBody({
        typeWebhook: 'incomingMessageReceived',
        timestamp: Math.floor(Date.now() / 1000),
        idMessage: faker.string.numeric(13),
        senderData: createSenderData({
          chatId,
          sender: chatId,
          chatType: 'user',
          senderPhoneNumber: Number(phone),
        }),
        messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: text } },
      }),
    )
  }

  const handlers = [
    http.get(`${INSTANCE}/getStateInstance/:apiTokenInstance`, () =>
      HttpResponse.json(createStateInstance({ stateInstance: 'authorized' })),
    ),

    http.get(`${INSTANCE}/getSettings/:apiTokenInstance`, () =>
      HttpResponse.json(
        createSettings({
          webhookUrl: '',
          incomingWebhook: 'yes',
          outgoingWebhook: 'yes',
          outgoingAPIMessageWebhook: 'yes',
        }),
      ),
    ),

    http.post(`${INSTANCE}/sendMessage/:apiTokenInstance`, async ({ request }) => {
      const { chatId, message } = sendMessageRequestSchema.parse(await request.json())
      const idMessage = faker.string.numeric(13)
      const phone = chatId.replace('@c.us', '')

      setTimeout(() => {
        replyFrom(phone, `Эхо: ${message}`)
      }, replyDelayMs)

      return HttpResponse.json({ idMessage })
    }),

    http.get(`${INSTANCE}/receiveNotification/:apiTokenInstance`, async () => {
      const [next] = queue
      if (!next) {
        await delay(emptyQueueDelayMs)
        return HttpResponse.json(null)
      }
      return HttpResponse.json(next)
    }),

    http.delete(`${INSTANCE}/deleteNotification/:apiTokenInstance/:receiptId`, ({ params }) => {
      const receiptId = Number(params.receiptId)
      const exists = queue.some((item) => item.receiptId === receiptId)
      queue = queue.filter((item) => item.receiptId !== receiptId)
      return HttpResponse.json({ result: exists })
    }),
  ]

  return {
    handlers,
    enqueue,
    replyFrom,
    reset: () => {
      queue = []
      lastReceiptId = 0
    },
  }
}
