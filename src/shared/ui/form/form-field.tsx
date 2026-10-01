import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { Controller, type ControllerRenderProps, useFormContext } from 'react-hook-form'

import { cn } from '@/shared/lib/cn'

import { Field } from '../field'
import { FormMessage } from './form-message'

type FormFieldProps = Omit<
  ComponentProps<typeof Field.Control>,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'render'
> & {
  name: string
  label: ReactNode
  hideLabel?: boolean
  rootClassName?: string
  render?: ReactElement
  renderControl?: (field: ControllerRenderProps) => ReactNode
}

export const FormField = ({
  name,
  label,
  hideLabel,
  rootClassName,
  render,
  renderControl,
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
          {renderControl ? (
            renderControl(field)
          ) : (
            <Field.Control
              {...controlProps}
              render={render}
              className={className}
              ref={field.ref}
              name={field.name}
              value={(field.value as string | undefined) ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </Field.Root>
      )}
    />
  )
}
