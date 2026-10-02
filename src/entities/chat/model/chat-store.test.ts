import type { MessageEvent } from '../lib/parse-notification'
import { useChatStore } from './chat-store'

const store = () => useChatStore.getState()

const event = (overrides: Partial<MessageEvent> = {}): MessageEvent => ({
  id: 'in-1',
  direction: 'in',
  text: 'Привет',
  timestamp: 2_000,
  maxChatId: '10000000',
  phone: '79991234567',
  name: null,
  ...overrides,
})

describe('chat store', () => {
  it('opens a chat by phone once and makes it active', () => {
    store().openChat('79991234567')
    store().openChat('79991234567')

    expect(Object.keys(store().chats)).toEqual(['79991234567'])
    expect(store().activeChatId).toBe('79991234567')

    store().closeChat()
    expect(store().activeChatId).toBeNull()
  })

  it('learns the MAX chat id from our own sent message', () => {
    store().openChat('79991234567')
    store().addOutgoing('79991234567', {
      id: 'local',
      text: 'hi',
      direction: 'out',
      timestamp: 1_000,
      status: 'pending',
    })
    store().resolveOutgoing('79991234567', 'local', { id: 'srv-1', status: 'sent' })
    store().applyEvent(event({ id: 'srv-1', direction: 'out', phone: null }))
    store().applyEvent(event({ id: 'in-2', phone: null }))

    const chat = store().chats['79991234567']
    expect(chat?.maxChatId).toBe('10000000')
    expect(chat?.messages.map(({ id }) => id)).toEqual(['srv-1', 'in-2'])
  })

  it('drops the optimistic copy when the notification arrived before the response', () => {
    store().openChat('79991234567')
    store().addOutgoing('79991234567', {
      id: 'local',
      text: 'hi',
      direction: 'out',
      timestamp: 1_000,
      status: 'pending',
    })
    store().applyEvent(event({ id: 'srv-1', direction: 'out', phone: null, maxChatId: 'unknown' }))
    // the event could not be matched yet, so it created its own chat keyed by MAX id
    store().applyEvent(event({ id: 'srv-1', direction: 'out' }))
    store().resolveOutgoing('79991234567', 'local', { id: 'srv-1', status: 'sent' })

    expect(store().chats['79991234567']?.messages.map(({ id }) => id)).toEqual(['srv-1'])
  })

  it('resolves only the matching optimistic message', () => {
    store().openChat('79991234567')
    store().addOutgoing('79991234567', {
      id: 'a',
      text: '1',
      direction: 'out',
      timestamp: 1,
      status: 'pending',
    })
    store().addOutgoing('79991234567', {
      id: 'b',
      text: '2',
      direction: 'out',
      timestamp: 2,
      status: 'pending',
    })
    store().resolveOutgoing('79991234567', 'b', { status: 'failed' })

    expect(store().chats['79991234567']?.messages.map(({ id, status }) => [id, status])).toEqual([
      ['a', 'pending'],
      ['b', 'failed'],
    ])
  })

  it('ignores updates for chats that do not exist', () => {
    store().addOutgoing('nope', {
      id: 'x',
      text: '',
      direction: 'out',
      timestamp: 0,
      status: 'pending',
    })
    store().resolveOutgoing('nope', 'x', { status: 'failed' })

    expect(store().chats).toEqual({})
  })

  it('keys a chat by MAX id when the phone is unknown and keeps the contact name', () => {
    store().applyEvent(event({ phone: null, name: 'Анна' }))
    store().applyEvent(event({ id: 'in-2', phone: null, name: null, timestamp: 1_000 }))

    const chat = store().chats['10000000']
    expect(chat).toMatchObject({ phone: null, name: 'Анна', updatedAt: 2_000 })
    expect(chat?.messages.map(({ id }) => id)).toEqual(['in-2', 'in-1'])
  })

  it('resets everything on sign out', () => {
    store().openChat('79991234567')
    store().reset()

    expect(store()).toMatchObject({ chats: {}, activeChatId: null })
  })
})
