import { type AppError, normalizeError } from '@/shared/api'
import { translate } from '@/shared/lib/i18n'
import { toast } from '@/shared/ui/toast'

export const showErrorToast = (appError: AppError) => {
  if (appError.kind !== 'aborted') {
    toast.error(translate(appError.message))
  }
}

/**
 * Standalone error handler: shows a meaningful toast when the error is recognised,
 * "unknown server error" otherwise. Returns the normalized error for further branching.
 */
export const resolveErrorAsync = async (error: unknown): Promise<AppError> => {
  const appError = await normalizeError(error)
  showErrorToast(appError)
  return appError
}
