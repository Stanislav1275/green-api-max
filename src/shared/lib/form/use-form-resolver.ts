import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import { type AppError, normalizeError } from '@/shared/api'

import { showErrorToast } from '../errors'

type FormResolverOptions<TValues extends FieldValues> = {
  fieldMap?: Partial<Record<string, FieldPath<TValues>>>
}

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix -- paired with useForm by contract: called in render with the form instance
export const useFormResolver = <TValues extends FieldValues>(
  form: Pick<UseFormReturn<TValues>, 'setError' | 'getValues'>,
  { fieldMap = {} }: FormResolverOptions<TValues> = {},
) => {
  const resolveError = async (error: unknown): Promise<AppError> => {
    const appError = await normalizeError(error)

    if (appError.kind === 'validation') {
      const values = form.getValues()
      const matched = Object.entries(appError.fields).flatMap(([serverField, message]) => {
        const field = fieldMap[serverField] ?? (serverField in values ? serverField : null)
        return field ? [{ field: field as FieldPath<TValues>, message }] : []
      })

      matched.forEach(({ field, message }, index) => {
        form.setError(field, { type: 'server', message }, { shouldFocus: index === 0 })
      })
      if (matched.length === Object.keys(appError.fields).length) {
        return appError
      }
    }

    showErrorToast(appError)
    return appError
  }

  return { resolveError }
}
