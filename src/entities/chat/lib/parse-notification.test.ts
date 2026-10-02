import { parseNotification } from './parse-notification'

const base = {
  timestamp: 1_763_115_112,
  idMessage: '1763115112345',
  senderData: {
    chatId: '10000000',
    sender: '10000000',
    senderName: 'Анна',
    senderContactName: '',
    senderPhoneNumber: 79876543210,
  },
  messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Привет' } },
}

describe('parseNotification', () => {
  it('reads an incoming text message; the phone comes from senderPhoneNumber', () => {
    expect(parseNotification({ ...base, typeWebhook: 'incomingMessageReceived' })).toEqual({
      id: '1763115112345',
      direction: 'in',
      text: 'Привет',
      timestamp: 1_763_115_112_000,
      maxChatId: '10000000',
      phone: '79876543210',
      name: 'Анна',
    })
  })

  it('reads extended text and takes the phone from a phone@c.us chat id', () => {
    expect(
      parseNotification({
        ...base,
        typeWebhook: 'incomingMessageReceived',
        senderData: { chatId: '79991234567@c.us', sender: '79991234567@c.us' },
        messageData: {
          typeMessage: 'extendedTextMessage',
          extendedTextMessageData: { text: 'ссылка' },
        },
      }),
    ).toMatchObject({ text: 'ссылка', phone: '79991234567', name: null })
  })

  it.each(['outgoingMessageReceived', 'outgoingAPIMessageReceived'])(
    '%s is outgoing without a contact name or phone',
    (typeWebhook) => {
      expect(parseNotification({ ...base, typeWebhook })).toMatchObject({
        direction: 'out',
        phone: null,
        name: null,
      })
    },
  )

  it.each([
    ['a status change', { typeWebhook: 'stateInstanceChanged', timestamp: 1 }],
    [
      'an image',
      {
        ...base,
        typeWebhook: 'incomingMessageReceived',
        messageData: { typeMessage: 'imageMessage' },
      },
    ],
    ['no sender', { ...base, typeWebhook: 'incomingMessageReceived', senderData: undefined }],
    ['no message id', { ...base, typeWebhook: 'incomingMessageReceived', idMessage: undefined }],
    ['a malformed payload', { typeWebhook: 42 }],
    ['nothing', null],
  ])('ignores %s', (_case, payload) => {
    expect(parseNotification(payload)).toBeNull()
  })
})
