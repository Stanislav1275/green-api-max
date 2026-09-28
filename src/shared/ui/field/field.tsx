import { Field as BaseField } from '@base-ui/react/field'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib/cn'

import { inputClassName } from '../input'

const Root = ({ className, ...props }: ComponentProps<typeof BaseField.Root>) => (
  <BaseField.Root data-slot="field" className={cn('grid gap-1.5', className)} {...props} />
)

const Label = ({ className, ...props }: ComponentProps<typeof BaseField.Label>) => (
  <BaseField.Label
    data-slot="field-label"
    className={cn('text-sm font-medium', className)}
    {...props}
  />
)

/** Unstyled when used with `render` (e.g. a textarea brings its own styles). */
const Control = ({ className, render, ...props }: ComponentProps<typeof BaseField.Control>) => (
  <BaseField.Control
    data-slot="field-control"
    render={render}
    className={render ? className : cn(inputClassName, className)}
    {...props}
  />
)

const Description = ({ className, ...props }: ComponentProps<typeof BaseField.Description>) => (
  <BaseField.Description
    data-slot="field-description"
    className={cn('text-xs text-muted-foreground', className)}
    {...props}
  />
)

const Error = ({ className, ...props }: ComponentProps<typeof BaseField.Error>) => (
  <BaseField.Error
    data-slot="field-error"
    className={cn('text-xs text-destructive', className)}
    {...props}
  />
)

/**
 * Compound field: `<Field.Root name="x"><Field.Label /><Field.Control /><Field.Error /></Field.Root>`.
 * Label/description/error are wired to the control via aria attributes by Base UI.
 */
export const Field = { Root, Label, Control, Description, Error }
