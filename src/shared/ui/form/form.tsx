import { Form as BaseForm } from '@base-ui/react/form'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

/** Native form + Base UI field registry: `errors` maps field `name` to a server-side message. */
export const Form = ({ className, ...props }: ComponentProps<typeof BaseForm>) => (
  <BaseForm data-slot="form" className={cn('grid gap-4', className)} {...props} />
)
