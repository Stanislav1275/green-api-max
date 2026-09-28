import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form'

import { type AppError, normalizeError } from '@/shared/api'

import { showErrorToast } from '../errors'

type FormResolverOptions<TValues extends FieldValues> = {
  /** server field name → form field name, when they differ (`message` → `text`) */
  fieldMap?: Partial<Record<string, FieldPath<TValues>>>
}

/**
 * Binds server errors to a react-hook-form instance: field errors from the response
 * light up the matching fields (rendered by `FormMessage`), everything else goes to a toast.
 */
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
      // every server error found its field — the form already says it all
      if (matched.length === Object.keys(appError.fields).length) {
        return appError
      }
    }

    showErrorToast(appError)
    return appError
  }

  return { resolveError }
}
