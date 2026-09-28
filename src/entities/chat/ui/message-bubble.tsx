import { Check, CircleAlert, Clock } from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { formatTime } from '@/shared/lib/format'

import type { Message } from '../model/types'

const STATUS_ICON = {
  pending: <Clock aria-label="Отправляется" className="size-3.5" />,
  sent: <Check aria-label="Отправлено" className="size-3.5" />,
  failed: <CircleAlert aria-label="Не отправлено" className="size-3.5 text-[#ffb8b8]" />,
}

/** MAX bubble: 16px radius, gradient for own messages, time tucked into the last line. */
export const MessageBubble = ({ message }: { message: Message }) => {
  const outgoing = message.direction === 'out'
  return (
    <li
      data-direction={message.direction}
      className={cn(
        'max-w-[min(80%,34rem)] rounded-xl px-3 pt-1.5 pb-1 text-[15px] leading-snug',
        outgoing
          ? 'self-end rounded-br-md bg-bubble-out text-bubble-out-foreground'
          : 'self-start rounded-bl-md bg-bubble-in text-bubble-in-foreground',
      )}
    >
      <p className="break-words whitespace-pre-wrap">
        {message.text}
        {/* reserves room so the time never overlaps the last line */}
        <span aria-hidden className="inline-block w-14" />
      </p>
      <p
        className={cn(
          '-mt-4 flex items-center justify-end gap-1 text-[11px] tabular-nums',
          outgoing ? 'text-bubble-out-meta' : 'text-bubble-in-meta',
        )}
      >
        {formatTime(message.timestamp)}
        {outgoing ? STATUS_ICON[message.status] : null}
      </p>
    </li>
  )
}
