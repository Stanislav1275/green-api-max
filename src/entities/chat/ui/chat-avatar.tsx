import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/avatar'

const GRADIENTS = [
  'from-[#ff48b6] to-[#ff8a35]', // coral
  'from-[#ffc93d] to-[#ff832a]', // orange
  'from-[#14e1d5] to-[#03c722]', // green
  'from-[#08d7f3] to-[#5398ff]', // sky
  'from-[#bf97ff] to-[#526eff]', // violet
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
    <Avatar.Root className={cn('bg-linear-to-b text-white', pickGradient(seed), className)}>
      <Avatar.Fallback>{initials}</Avatar.Fallback>
    </Avatar.Root>
  )
}
