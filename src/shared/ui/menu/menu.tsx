import { Menu as BaseMenu } from '@base-ui/react/menu'
import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

type ContentProps = ComponentProps<typeof BaseMenu.Popup> & {
  align?: ComponentProps<typeof BaseMenu.Positioner>['align']
}

const Content = ({ className, align = 'start', ...props }: ContentProps) => (
  <BaseMenu.Portal>
    <BaseMenu.Positioner align={align} sideOffset={8} className="z-50">
      <BaseMenu.Popup
        data-slot="menu"
        className={cn(
          'min-w-48 origin-[var(--transform-origin)] rounded-xl bg-popover p-1.5 shadow-xl ring-1 ring-divider transition-[scale,opacity] duration-150 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
          className,
        )}
        {...props}
      />
    </BaseMenu.Positioner>
  </BaseMenu.Portal>
)

const RadioItem = ({
  className,
  children,
  ...props
}: ComponentProps<typeof BaseMenu.RadioItem>) => (
  <BaseMenu.RadioItem
    className={cn(
      'flex h-10 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-[15px] outline-none select-none data-highlighted:bg-hover',
      className,
    )}
    {...props}
  >
    {children}
    <BaseMenu.RadioItemIndicator className="text-link">
      <Check />
    </BaseMenu.RadioItemIndicator>
  </BaseMenu.RadioItem>
)

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Content,
  RadioGroup: BaseMenu.RadioGroup,
  RadioItem,
}
