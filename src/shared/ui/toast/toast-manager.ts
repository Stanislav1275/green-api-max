import { Toast } from '@base-ui/react/toast'

/** Module-level manager: toasts can be raised outside React (query cache, error resolvers). */
export const toastManager = Toast.createToastManager()

export const toast = {
  error: (description: string, title = 'Ошибка') =>
    toastManager.add({ type: 'error', title, description, priority: 'high' }),
  success: (description: string, title?: string) =>
    toastManager.add({ type: 'success', title, description }),
}
