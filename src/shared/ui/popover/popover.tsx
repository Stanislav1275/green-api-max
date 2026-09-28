import { Popover as BasePopover } from '@base-ui/react/popover'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type ContentProps = ComponentProps<typeof BasePopover.Popup> & {
  side?: ComponentProps<typeof BasePopover.Positioner>['side']
  align?: ComponentProps<typeof BasePopover.Positioner>['align']
}

const Content = ({ className, side = 'bottom', align = 'end', ...props }: ContentProps) => (
  <BasePopover.Portal>
    <BasePopover.Positioner side={side} align={align} sideOffset={8} className="z-50">
      <BasePopover.Popup
        data-slot="popover"
        className={cn(
          'w-80 max-w-[var(--available-width)] origin-[var(--transform-origin)] rounded-xl bg-popover p-4 text-sm shadow-xl ring-1 ring-divider transition-[scale,opacity] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          className,
        )}
        {...props}
      />
    </BasePopover.Positioner>
  </BasePopover.Portal>
)

const Title = ({ className, ...props }: ComponentProps<typeof BasePopover.Title>) => (
  <BasePopover.Title className={cn('mb-2 text-base font-medium', className)} {...props} />
)

export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Content,
  Title,
  Description: BasePopover.Description,
}
