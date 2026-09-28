import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type ScrollAreaProps = ComponentProps<typeof BaseScrollArea.Root> & {
  viewportProps?: ComponentProps<typeof BaseScrollArea.Viewport>
}

export const ScrollArea = ({ className, children, viewportProps, ...props }: ScrollAreaProps) => (
  <BaseScrollArea.Root
    data-slot="scroll-area"
    className={cn('relative min-h-0 overflow-hidden', className)}
    {...props}
  >
    <BaseScrollArea.Viewport
      data-slot="scroll-area-viewport"
      {...viewportProps}
      className={cn('size-full overscroll-contain outline-none', viewportProps?.className)}
    >
      {children}
    </BaseScrollArea.Viewport>
    <BaseScrollArea.Scrollbar
      orientation="vertical"
      className="m-1 flex w-1.5 justify-center rounded-full opacity-0 transition-opacity data-hovering:opacity-100 data-scrolling:opacity-100"
    >
      <BaseScrollArea.Thumb className="w-full rounded-full bg-muted-foreground/40" />
    </BaseScrollArea.Scrollbar>
  </BaseScrollArea.Root>
)
