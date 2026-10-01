import { type AppError, normalizeError } from '@/shared/api'
import { translate } from '@/shared/lib/i18n'
import { toast } from '@/shared/ui/toast'

export const showErrorToast = (appError: AppError) => {
  if (appError.kind !== 'aborted') {
    toast.error(translate(appError.message))
  }
}

export const resolveErrorAsync = async (error: unknown): Promise<AppError> => {
  const appError = await normalizeError(error)
  showErrorToast(appError)
  return appError
}
