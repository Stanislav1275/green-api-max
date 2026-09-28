import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

const Root = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="card"
    className={cn('flex flex-col gap-6 rounded-xl border bg-card py-6 shadow-sm', className)}
    {...props}
  />
)

const Header = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="card-header" className={cn('grid gap-1.5 px-6', className)} {...props} />
)

const Title = ({ className, ...props }: ComponentProps<'h2'>) => (
  <h2
    data-slot="card-title"
    className={cn('text-lg leading-none font-semibold', className)}
    {...props}
  />
)

const Description = ({ className, ...props }: ComponentProps<'p'>) => (
  <p
    data-slot="card-description"
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
)

const Content = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="card-content" className={cn('px-6', className)} {...props} />
)

const Footer = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="card-footer" className={cn('flex items-center px-6', className)} {...props} />
)

export const Card = { Root, Header, Title, Description, Content, Footer }
