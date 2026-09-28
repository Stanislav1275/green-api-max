import { ChatListItem, useChatList, useChatStore } from '@/entities/chat'
import { useCredentials } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { SignOutButton } from '@/features/sign-out'
import { cn } from '@/shared/lib/cn'
import { ScrollArea } from '@/shared/ui/scroll-area'

export const ChatSidebar = ({ className }: { className?: string }) => {
  const chats = useChatList()
  const activeChatId = useChatStore((state) => state.activeChatId)
  const openChat = useChatStore((state) => state.openChat)
  const idInstance = useCredentials()?.idInstance

  return (
    <aside className={cn('flex min-h-0 flex-col border-r bg-background', className)}>
      <header className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">Чаты</h1>
          <p className="truncate text-xs text-muted-foreground">Инстанс {idInstance}</p>
        </div>
        <SignOutButton />
      </header>

      <div className="px-4 pb-3">
        <CreateChatForm />
      </div>

      <ScrollArea className="flex-1">
        {chats.length > 0 ? (
          <nav aria-label="Список чатов" className="grid gap-0.5 px-2 pb-2">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                active={chat.id === activeChatId}
                onSelect={openChat}
              />
            ))}
          </nav>
        ) : (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">
            Введите номер получателя, чтобы начать переписку
          </p>
        )}
      </ScrollArea>
    </aside>
  )
}
