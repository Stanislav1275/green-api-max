import { Button as BaseButton } from '@base-ui/react/button'
import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

import { buttonVariants } from './button-variants'

export type ButtonProps = ComponentProps<typeof BaseButton> & VariantProps<typeof buttonVariants>

export const Button = ({ className, variant, size, ...props }: ButtonProps) => (
  <BaseButton
    data-slot="button"
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
)
