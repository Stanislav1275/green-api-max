import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/avatar'

const GRADIENTS = [
  'from-sky-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
]

const pickGradient = (seed: string) => {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash += seed.charCodeAt(index)
  }
  return GRADIENTS[hash % GRADIENTS.length]
}

type ChatAvatarProps = {
  seed: string
  title: string
  className?: string
}

export const ChatAvatar = ({ seed, title, className }: ChatAvatarProps) => {
  const initials = /\p{L}/u.test(title) ? title.trim().slice(0, 1).toUpperCase() : '#'
  return (
    <Avatar.Root className={cn('bg-linear-to-br text-white', pickGradient(seed), className)}>
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar.Root>
  )
}
