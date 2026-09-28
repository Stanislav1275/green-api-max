import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { cn } from '@/shared/lib/cn'

import { Field } from '../field'
import { FormMessage } from './form-message'

type FormFieldProps = Omit<
  ComponentProps<typeof Field.Control>,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'render'
> & {
  name: string
  label: ReactNode
  /** keeps the label for screen readers only */
  hideLabel?: boolean
  rootClassName?: string
  /** swap the `<input>` for another control, e.g. `render={<Textarea />}` */
  render?: ReactElement
}

/**
 * Field bound to the surrounding `<Form>`: label, control and `FormMessage` are linked
 * through Base UI aria wiring; errors come from zod or from the server via `setError`.
 */
export const FormField = ({
  name,
  label,
  hideLabel,
  rootClassName,
  render,
  className,
  ...controlProps
}: FormFieldProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field.Root
          name={name}
          invalid={fieldState.invalid}
          touched={fieldState.isTouched}
          dirty={fieldState.isDirty}
          className={rootClassName}
        >
          <Field.Label className={cn(hideLabel && 'sr-only')}>{label}</Field.Label>
          <Field.Control
            {...controlProps}
            render={render}
            className={className}
            ref={field.ref}
            name={field.name}
            value={(field.value as string | undefined) ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={field.disabled ?? controlProps.disabled}
          />
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </Field.Root>
      )}
    />
  )
}
