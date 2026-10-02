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
import { useTranslation } from '@/shared/lib/i18n'
import { formatPhone } from '@/shared/lib/phone'
import { Button } from '@/shared/ui/button'
import { ScrollArea } from '@/shared/ui/scroll-area'

export const ChatWindow = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
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
          'bg-space-pattern flex flex-col items-center justify-center gap-3 bg-chat-background text-subtle-foreground',
          className,
        )}
      >
        <MessagesSquare className="size-12 opacity-60" />
        <p className="rounded-full bg-background/70 px-4 py-1.5 text-sm backdrop-blur">
          {t('chat.placeholder')}
        </p>
      </section>
    )
  }

  const title = getChatTitle(chat, t)

  return (
    <section
      aria-label={t('chat.region', { title })}
      className={cn('flex min-h-0 flex-col', className)}
    >
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-divider bg-background px-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('chat.back')}
          className="md:hidden"
          onClick={closeChat}
        >
          <ArrowLeft />
        </Button>
        <ChatAvatar seed={chat.id} title={title} />
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium">{title}</h2>
          {chat.phone && chat.name ? (
            <p className="truncate text-[13px] text-subtle-foreground">{formatPhone(chat.phone)}</p>
          ) : null}
        </div>
      </header>

      <ScrollArea
        className="bg-space-pattern flex-1 bg-chat-background"
        viewportProps={{ ref: viewportRef }}
      >
        {chat.messages.length > 0 ? (
          <ol
            aria-label={t('chat.messages')}
            className="mx-auto flex max-w-3xl flex-col gap-1 px-3 py-4 md:px-6"
          >
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </ol>
        ) : (
          <p className="mx-auto mt-10 w-fit rounded-full bg-background/70 px-4 py-1.5 text-center text-sm text-subtle-foreground backdrop-blur">
            {t('chat.noMessages')}
          </p>
        )}
      </ScrollArea>

      <SendMessageForm chat={chat} />
    </section>
  )
}
