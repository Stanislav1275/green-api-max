import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export const Textarea = ({ className, ...props }: ComponentProps<'textarea'>) => (
  <textarea
    data-slot="textarea"
    className={cn(
      'field-sizing-content max-h-40 min-h-11 w-full resize-none rounded-lg bg-writebar px-4 py-2.5 text-base text-foreground outline-none placeholder:text-subtle-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:opacity-50 md:text-[15px]',
      className,
    )}
    {...props}
  />
)
