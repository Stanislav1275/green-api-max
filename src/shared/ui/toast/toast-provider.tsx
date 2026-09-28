import { Toast } from '@base-ui/react/toast'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { toastManager } from './toast-manager'

const ToastList = () => {
  const { toasts } = Toast.useToastManager()
  return toasts.map((item) => (
    <Toast.Root
      key={item.id}
      toast={item}
      className="relative grid w-80 gap-1 rounded-xl border bg-card p-4 pr-10 shadow-lg transition-all data-ending-style:translate-y-2 data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 data-[type=error]:border-destructive/40"
    >
      <Toast.Content>
        <Toast.Title className="text-sm font-medium in-data-[type=error]:text-destructive" />
        <Toast.Description className="text-sm text-muted-foreground" />
      </Toast.Content>
      <Toast.Close
        aria-label="Закрыть"
        className="absolute top-3 right-3 rounded-md p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="size-4" />
      </Toast.Close>
    </Toast.Root>
  ))
}

export const ToastProvider = ({ children }: { children: ReactNode }) => (
  <Toast.Provider toastManager={toastManager} limit={3}>
    {children}
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex flex-col gap-2 max-sm:right-2 max-sm:left-2">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
)
