import { SendHorizontal } from 'lucide-react'
import { type KeyboardEvent, useState } from 'react'

import type { Chat } from '@/entities/chat'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'

import { MAX_MESSAGE_LENGTH, useSendMessage } from '../model/use-send-message'

export const SendMessageForm = ({ chat }: { chat: Chat }) => {
  const [text, setText] = useState('')
  const sendMessage = useSendMessage()
  const trimmed = text.trim()

  const submit = () => {
    if (!trimmed) {
      return
    }
    sendMessage.mutate({ chatId: chat.id, recipient: chat.phone ?? chat.id, text: trimmed })
    setText('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form
      className="flex items-end gap-2 border-t bg-background p-3"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <Textarea
        aria-label="Сообщение"
        placeholder="Сообщение"
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        value={text}
        onChange={(event) => {
          setText(event.target.value)
        }}
        onKeyDown={handleKeyDown}
        className="rounded-2xl"
      />
      <Button
        type="submit"
        size="icon"
        className="rounded-full"
        aria-label="Отправить"
        disabled={!trimmed}
      >
        <SendHorizontal />
      </Button>
    </form>
  )
}
