import { Check, CircleAlert, Clock } from 'lucide-react'

import { cn } from '@/shared/lib/cn'
import { formatTime } from '@/shared/lib/format'
import { useTranslation } from '@/shared/lib/i18n'

import type { Message } from '../model/types'

const STATUS_ICON = {
  pending: Clock,
  sent: Check,
  failed: CircleAlert,
}

/** MAX bubble: 16px radius, gradient for own messages, time tucked into the last line. */
export const MessageBubble = ({ message }: { message: Message }) => {
  const { t, i18n } = useTranslation()
  const outgoing = message.direction === 'out'
  const StatusIcon = STATUS_ICON[message.status]
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
        {formatTime(message.timestamp, i18n.language)}
        {outgoing ? (
          <StatusIcon
            aria-label={t(`chat.status.${message.status}`)}
            className={cn('size-3.5', message.status === 'failed' && 'text-[#ffb8b8]')}
          />
        ) : null}
      </p>
    </li>
  )
}
