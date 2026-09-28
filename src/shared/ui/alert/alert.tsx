import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

const alertVariants = cva(
  'grid gap-1 rounded-lg border px-4 py-3 text-sm [&_a]:font-medium [&_a]:underline',
  {
    variants: {
      variant: {
        default: 'bg-card',
        warning:
          'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100 [&_[data-slot=alert-title]]:text-amber-950 dark:[&_[data-slot=alert-title]]:text-amber-50',
        destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
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
