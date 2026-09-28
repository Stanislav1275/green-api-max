import { LoaderCircle } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

export const Spinner = ({ className, ...props }: ComponentProps<'svg'>) => (
  <LoaderCircle
    role="status"
    aria-label="Загрузка"
    className={cn('animate-spin', className)}
    {...props}
  />
)
