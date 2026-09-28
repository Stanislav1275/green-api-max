import { Avatar as BaseAvatar } from '@base-ui/react/avatar'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

const Root = ({ className, ...props }: ComponentProps<typeof BaseAvatar.Root>) => (
  <BaseAvatar.Root
    data-slot="avatar"
    className={cn(
      'relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary align-middle text-base font-medium text-secondary-foreground select-none',
      className,
    )}
    {...props}
  />
)

const Image = ({ className, ...props }: ComponentProps<typeof BaseAvatar.Image>) => (
  <BaseAvatar.Image
    data-slot="avatar-image"
    className={cn('size-full object-cover', className)}
    {...props}
  />
)

const Fallback = ({ className, ...props }: ComponentProps<typeof BaseAvatar.Fallback>) => (
  <BaseAvatar.Fallback
    data-slot="avatar-fallback"
    className={cn('flex size-full items-center justify-center', className)}
    {...props}
  />
)

export const Avatar = { Root, Image, Fallback }
