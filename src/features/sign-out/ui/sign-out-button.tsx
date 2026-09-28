import { LogOut } from 'lucide-react'

import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { Button } from '@/shared/ui/button'

export const SignOutButton = () => {
  const signOut = useSessionStore((state) => state.signOut)
  const resetChats = useChatStore((state) => state.reset)

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Выйти"
      title="Выйти"
      onClick={() => {
        resetChats()
        signOut()
      }}
    >
      <LogOut />
    </Button>
  )
}
