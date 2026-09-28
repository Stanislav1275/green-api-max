import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

import { Field } from '../field'

/** Field error text (client zod or server `setError`); renders only when there is a message. */
export const FormMessage = ({
  className,
  children,
  ...props
}: ComponentProps<typeof Field.Error>) =>
  children ? (
    <Field.Error
      match
      data-slot="form-message"
      className={cn('px-4 text-[13px] leading-snug text-destructive', className)}
      {...props}
    >
      {children}
    </Field.Error>
  ) : null
