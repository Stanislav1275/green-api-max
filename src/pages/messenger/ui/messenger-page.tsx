import { useChatStore } from '@/entities/chat'
import { useReceiveMessages } from '@/features/receive-messages'
import { cn } from '@/shared/lib/cn'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'

export const MessengerPage = () => {
  useReceiveMessages()
  const hasActiveChat = useChatStore((state) => state.activeChatId !== null)

  return (
    <main className="grid h-full md:grid-cols-[22rem_1fr]">
      {/* on phones the list and the chat take turns, like in the MAX mobile web */}
      <ChatSidebar className={cn(hasActiveChat && 'max-md:hidden')} />
      <ChatWindow className={cn(!hasActiveChat && 'max-md:hidden')} />
    </main>
  )
}
