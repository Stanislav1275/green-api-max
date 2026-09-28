import type { ComponentProps, ReactNode } from 'react'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'

import { cn } from '@/shared/lib/cn'

import { Field } from '../field'
import { FormMessage } from './form-message'

type FormFieldProps<TValues extends FieldValues> = Omit<
  ComponentProps<typeof Field.Control>,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'
> & {
  control: Control<TValues>
  name: FieldPath<TValues>
  label: ReactNode
  /** keeps the label for screen readers only */
  hideLabel?: boolean
  rootClassName?: string
}

/**
 * react-hook-form field rendered with Base UI `Field`: label, control and error
 * are linked through aria attributes, invalid state comes from the zod resolver.
 */
export const FormField = <TValues extends FieldValues>({
  control,
  name,
  label,
  hideLabel,
  rootClassName,
  ...controlProps
}: FormFieldProps<TValues>) => (
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
          ref={field.ref}
          name={field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          disabled={field.disabled ?? controlProps.disabled}
        />
        <FormMessage>{fieldState.error?.message}</FormMessage>
      </Field.Root>
    )}
  />
)
