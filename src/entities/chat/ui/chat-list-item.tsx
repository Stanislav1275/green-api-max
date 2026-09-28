import { cn } from '@/shared/lib/cn'
import { formatTime } from '@/shared/lib/format'

import { getChatTitle } from '../lib/chat-title'
import type { Chat } from '../model/types'
import { ChatAvatar } from './chat-avatar'

type ChatListItemProps = {
  chat: Chat
  active: boolean
  onSelect: (chatId: string) => void
}

export const ChatListItem = ({ chat, active, onSelect }: ChatListItemProps) => {
  const title = getChatTitle(chat)
  const lastMessage = chat.messages.at(-1)

  return (
    <button
      type="button"
      aria-current={active ? 'true' : undefined}
      onClick={() => {
        onSelect(chat.id)
      }}
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors outline-none hover:bg-hover focus-visible:ring-2 focus-visible:ring-ring',
        active && 'bg-muted hover:bg-muted',
      )}
    >
      <ChatAvatar seed={chat.id} title={title} className="size-13 text-lg" />
      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[15px] font-medium">{title}</span>
          {lastMessage ? (
            <span className="shrink-0 text-xs text-subtle-foreground">
              {formatTime(lastMessage.timestamp)}
            </span>
          ) : null}
        </span>
        <span className="truncate text-sm text-subtle-foreground">
          {lastMessage
            ? `${lastMessage.direction === 'out' ? 'Вы: ' : ''}${lastMessage.text}`
            : 'Нет сообщений'}
        </span>
      </span>
    </button>
  )
}
