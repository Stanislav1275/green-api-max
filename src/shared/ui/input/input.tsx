import { Input as BaseInput } from '@base-ui/react/input'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

import { inputClassName } from './input-class-name'

export const Input = ({ className, ...props }: ComponentProps<typeof BaseInput>) => (
  <BaseInput data-slot="input" className={cn(inputClassName, className)} {...props} />
)
