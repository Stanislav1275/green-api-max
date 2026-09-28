import { LogOut } from 'lucide-react'

import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { useTranslation } from '@/shared/lib/i18n'
import { Button } from '@/shared/ui/button'

export const SignOutButton = () => {
  const { t } = useTranslation()
  const signOut = useSessionStore((state) => state.signOut)
  const resetChats = useChatStore((state) => state.reset)

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t('chats.signOut')}
      title={t('chats.signOut')}
      onClick={() => {
        resetChats()
        signOut()
      }}
    >
      <LogOut />
    </Button>
  )
}
