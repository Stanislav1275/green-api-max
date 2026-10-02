import type { ComponentProps } from 'react'
import { type FieldValues, FormProvider, type UseFormReturn } from 'react-hook-form'

import { useFormResolver } from '@/shared/lib/form'

type FormProps<TInput extends FieldValues, TOutput extends FieldValues> = Omit<
  ComponentProps<'form'>,
  'onSubmit'
> & {
  form: UseFormReturn<TInput, unknown, TOutput>
  onSubmit: (values: TOutput) => unknown
  resetOnSubmit?: boolean
}

export const Form = <TInput extends FieldValues, TOutput extends FieldValues>({
  form,
  onSubmit,
  resetOnSubmit = false,
  children,
  ...props
}: FormProps<TInput, TOutput>) => {
  const { resolveError } = useFormResolver(form)

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      if (resetOnSubmit) {
        form.reset()
      }
    } catch (error) {
      await resolveError(error)
    }
  })

  return (
    <FormProvider {...form}>
      <form noValidate data-slot="form" onSubmit={(event) => void submit(event)} {...props}>
        {children}
      </form>
    </FormProvider>
  )
}
