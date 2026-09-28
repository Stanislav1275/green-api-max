import { Check, CircleAlert, Clock } from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { formatTime } from '@/shared/lib/format'

import type { Message } from '../model/types'

const STATUS_ICON = {
  pending: <Clock aria-label="Отправляется" className="size-3" />,
  sent: <Check aria-label="Отправлено" className="size-3" />,
  failed: <CircleAlert aria-label="Не отправлено" className="size-3 text-destructive" />,
}

export const MessageBubble = ({ message }: { message: Message }) => {
  const outgoing = message.direction === 'out'
  return (
    <li
      data-direction={message.direction}
      className={cn(
        'max-w-[min(80%,36rem)] rounded-2xl px-3 py-1.5 text-sm shadow-xs',
        outgoing ? 'self-end rounded-br-md bg-bubble-out' : 'self-start rounded-bl-md bg-bubble-in',
      )}
    >
      <p className="break-words whitespace-pre-wrap">{message.text}</p>
      <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
        {formatTime(message.timestamp)}
        {outgoing ? STATUS_ICON[message.status] : null}
      </p>
    </li>
  )
}
