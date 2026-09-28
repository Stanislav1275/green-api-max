import { ChatListItem, useChatList, useChatStore } from '@/entities/chat'
import { useCredentials } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { SignOutButton } from '@/features/sign-out'
import { LanguageMenu } from '@/features/switch-language'
import { cn } from '@/shared/lib/cn'
import { ScrollArea } from '@/shared/ui/scroll-area'

export const ChatSidebar = ({ className }: { className?: string }) => {
  const chats = useChatList()
  const activeChatId = useChatStore((state) => state.activeChatId)
  const openChat = useChatStore((state) => state.openChat)
  const idInstance = useCredentials()?.idInstance

  return (
    <aside className={cn('flex min-h-0 flex-col border-r border-divider bg-background', className)}>
      <header className="flex items-center gap-1 px-3 pt-3 pb-2">
        <div className="min-w-0 flex-1 px-1">
          <h1 className="text-2xl leading-tight font-semibold">Чаты</h1>
          <p className="truncate text-[13px] text-subtle-foreground">Инстанс {idInstance}</p>
        </div>
        <LanguageMenu />
        <SignOutButton />
      </header>

      <div className="px-3 pb-3">
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
          <p className="px-8 py-12 text-center text-sm text-balance text-subtle-foreground">
            Введите номер получателя, чтобы начать переписку
          </p>
        )}
      </ScrollArea>
    </aside>
  )
}
