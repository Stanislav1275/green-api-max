import { Toast } from '@base-ui/react/toast'

import { i18n } from '@/shared/lib/i18n'

/** Module-level manager: toasts can be raised outside React (query cache, error resolvers). */
export const toastManager = Toast.createToastManager()

export const toast = {
  error: (description: string, title = i18n.t('common.error')) =>
    toastManager.add({ type: 'error', title, description, priority: 'high' }),
  success: (description: string, title?: string) =>
    toastManager.add({ type: 'success', title, description }),
}
