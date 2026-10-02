import { getRecipientChatId } from './recipient-chat-id'

it('uses phone@c.us when the phone is known, the MAX chat id otherwise', () => {
  expect(getRecipientChatId({ id: '79991234567', phone: '79991234567' })).toBe('79991234567@c.us')
  expect(getRecipientChatId({ id: '12345678901234', phone: null })).toBe('12345678901234')
})
