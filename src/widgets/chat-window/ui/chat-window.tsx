import { ArrowLeft, MessagesSquare } from 'lucide-react'
import { useEffect, useRef } from 'react'

import {
  ChatAvatar,
  getChatTitle,
  MessageBubble,
  useActiveChat,
  useChatStore,
} from '@/entities/chat'
import { SendMessageForm } from '@/features/send-message'
import { cn } from '@/shared/lib/cn'
import { formatPhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'

export const ChatWindow = ({ className }: { className?: string }) => {
  const chat = useActiveChat()
  const closeChat = useChatStore((state) => state.closeChat)
  const viewportRef = useRef<HTMLDivElement>(null)
  const messageCount = chat?.messages.length ?? 0

  useEffect(() => {
    const viewport = viewportRef.current
    if (viewport && messageCount > 0) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
    }
  }, [messageCount, chat?.id])

  if (!chat) {
    return (
      <section
        className={cn(
          'flex flex-col items-center justify-center gap-3 bg-chat-background text-muted-foreground',
          className,
        )}
      >
        <MessagesSquare className="size-12 opacity-40" />
        <p className="text-sm">Выберите чат или создайте новый</p>
      </section>
    )
  }

  const title = getChatTitle(chat)

  return (
    <section aria-label={`Чат: ${title}`} className={cn('flex min-h-0 flex-col', className)}>
      <header className="flex items-center gap-3 border-b bg-background px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Назад к чатам"
          className="md:hidden"
          onClick={closeChat}
        >
          <ArrowLeft />
        </Button>
        <ChatAvatar seed={chat.id} title={title} />
        <div className="min-w-0">
          <h2 className="truncate font-medium">{title}</h2>
          {chat.phone && chat.name ? (
            <p className="truncate text-xs text-muted-foreground">{formatPhone(chat.phone)}</p>
          ) : null}
        </div>
      </header>

      <ScrollArea className="flex-1 bg-chat-background" viewportProps={{ ref: viewportRef }}>
        {chat.messages.length > 0 ? (
          <ol aria-label="Сообщения" className="flex flex-col gap-1.5 px-4 py-4">
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </ol>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            Сообщений пока нет — напишите первым
          </p>
        )}
      </ScrollArea>

      <SendMessageForm chat={chat} />
    </section>
  )
}
