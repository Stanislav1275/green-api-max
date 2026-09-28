import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

const alertVariants = cva(
  'grid gap-1 rounded-xl px-4 py-3 text-sm [&_a]:font-medium [&_a]:text-link',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        warning:
          'bg-amber-500/12 text-foreground [&_[data-slot=alert-title]]:text-amber-600 dark:[&_[data-slot=alert-title]]:text-amber-400',
        destructive: 'bg-destructive/12 text-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

type AlertProps = ComponentProps<'div'> & VariantProps<typeof alertVariants>

const Root = ({ className, variant, ...props }: AlertProps) => (
  <div
    data-slot="alert"
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
)

const Title = ({ className, ...props }: ComponentProps<'p'>) => (
  <p data-slot="alert-title" className={cn('font-medium', className)} {...props} />
)

const Description = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="alert-description" className={cn('opacity-90', className)} {...props} />
)

export const Alert = { Root, Title, Description }
