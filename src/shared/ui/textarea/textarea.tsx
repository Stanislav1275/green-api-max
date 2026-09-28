import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

/** Grows with its content via `field-sizing: content`, capped by `max-h-*`. */
export const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
  <textarea
    data-slot="textarea"
    className={cn(
      'field-sizing-content max-h-40 min-h-10 w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-50',
      className,
    )}
    {...props}
  />
)
