import { getChatTitle, useActiveChat } from '@/entities/chat'
import { useReceiveMessages } from '@/features/receive-messages'
import { cn } from '@/shared/lib/cn'
import { useTranslation } from '@/shared/lib/i18n'
import { Seo } from '@/shared/ui/seo'
import { ChatSidebar } from '@/widgets/chat-sidebar'
import { ChatWindow } from '@/widgets/chat-window'

export const MessengerPage = () => {
  useReceiveMessages()
  const { t } = useTranslation()
  const activeChat = useActiveChat()
  const hasActiveChat = activeChat !== undefined

  return (
    <main className="grid h-full md:grid-cols-[22rem_1fr]">
      {/* like web.max.ru: the open chat names the tab */}
      <Seo
        title={activeChat ? getChatTitle(activeChat, t) : t('seo.messenger.title')}
        description={t('seo.messenger.description')}
      />
      {/* on phones the list and the chat take turns, like in the MAX mobile web */}
      <ChatSidebar className={cn(hasActiveChat && 'max-md:hidden')} />
      <ChatWindow className={cn(!hasActiveChat && 'max-md:hidden')} />
    </main>
  )
}
