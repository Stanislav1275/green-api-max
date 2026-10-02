import { faker } from '@faker-js/faker'
import { delay, http, HttpResponse } from 'msw'

import {
  createNotificationBody,
  createSenderData,
  createSettings,
  createStateInstance,
} from '@/shared/api/gen/mocks'
import type { Notification, NotificationBody, SendMessageRequest } from '@/shared/api/gen/types'
import { sendMessageRequestSchema } from '@/shared/api/gen/zod'

const INSTANCE = '*/waInstance:idInstance'

type GreenApiMockOptions = {
  /** how long an empty long-poll hangs before returning `null` */
  emptyQueueDelayMs?: number
  /** how long the fake contact "types" the echo reply */
  replyDelayMs?: number
}

type MessageOptions = {
  phone: string
  text: string
  name?: string
}

// MAX addresses a private chat by a numeric id, not by `phone@c.us`
export const toMaxChatId = (phone: string) => String(Number(phone.slice(-8)) + 10_000_000)

const now = () => Math.floor(Date.now() / 1000)

const textMessage = (text: string) => ({
  typeMessage: 'textMessage',
  textMessageData: { textMessage: text },
})

/**
 * In-memory GREEN-API: a FIFO notification queue that behaves like the real one —
 * every sent message comes back as `outgoingAPIMessageReceived`, and the contact
 * answers with an echo addressed by a numeric MAX chat id.
 */
export const createGreenApiMock = ({
  emptyQueueDelayMs = 1_000,
  replyDelayMs = 1_500,
}: GreenApiMockOptions = {}) => {
  let lastReceiptId = 0
  let queue: Notification[] = []
  let autoReply = true
  let sentMessages: SendMessageRequest[] = []
  const timers = new Set<ReturnType<typeof setTimeout>>()

  const enqueue = (body: NotificationBody) => {
    lastReceiptId += 1
    queue.push({ receiptId: lastReceiptId, body })
  }

  /** a contact writes to us */
  const replyFrom = ({ phone, text, name = '' }: MessageOptions) => {
    const chatId = toMaxChatId(phone)
    enqueue(
      createNotificationBody({
        typeWebhook: 'incomingMessageReceived',
        timestamp: now(),
        idMessage: faker.string.numeric(13),
        senderData: createSenderData({
          chatId,
          sender: chatId,
          chatType: 'user',
          chatName: name,
          senderName: name,
          senderContactName: name,
          senderPhoneNumber: Number(phone),
        }),
        messageData: textMessage(text),
      }),
    )
  }

  /** the account owner writes from the MAX app on their phone */
  const outgoingFromPhone = ({ phone, text }: MessageOptions) => {
    enqueue(
      createNotificationBody({
        typeWebhook: 'outgoingMessageReceived',
        timestamp: now(),
        idMessage: faker.string.numeric(13),
        senderData: createSenderData({ chatId: toMaxChatId(phone), sender: '79990000000' }),
        messageData: textMessage(text),
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
      const body = sendMessageRequestSchema.parse(await request.json())
      sentMessages.push(body)
      const idMessage = faker.string.numeric(13)
      const phone = body.chatId.replace('@c.us', '')

      enqueue(
        createNotificationBody({
          typeWebhook: 'outgoingAPIMessageReceived',
          timestamp: now(),
          idMessage,
          senderData: createSenderData({ chatId: toMaxChatId(phone), sender: '79990000000' }),
          messageData: textMessage(body.message),
        }),
      )

      if (autoReply) {
        const timer = setTimeout(() => {
          timers.delete(timer)
          replyFrom({ phone, text: `Эхо: ${body.message}` })
        }, replyDelayMs)
        timers.add(timer)
      }

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
    outgoingFromPhone,
    setAutoReply: (enabled: boolean) => {
      autoReply = enabled
    },
    /** request bodies received by `sendMessage`, oldest first */
    getSentMessages: () => [...sentMessages],
    getQueueSize: () => queue.length,
    reset: () => {
      timers.forEach(clearTimeout)
      timers.clear()
      queue = []
      lastReceiptId = 0
      autoReply = true
      sentMessages = []
    },
  }
}
