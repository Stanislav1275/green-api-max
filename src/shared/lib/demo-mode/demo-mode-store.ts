import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { startMockWorker, stopMockWorker } from './mock-worker'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE ?? 'off'

export const DEMO_MODE_AVAILABLE = DEMO_MODE !== 'off'

type DemoModeState = {
  enabled: boolean
  pending: boolean
  setEnabled: (enabled: boolean) => Promise<void>
}

export const useDemoModeStore = create<DemoModeState>()(
  persist(
    (set) => ({
      enabled: DEMO_MODE === 'on',
      pending: false,
      setEnabled: async (enabled) => {
        set({ pending: true })
        try {
          if (enabled) {
            await startMockWorker()
          } else {
            stopMockWorker()
          }
          set({ enabled })
        } finally {
          set({ pending: false })
        }
      },
    }),
    {
      name: 'green-api-max/demo-mode',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ enabled }) => ({ enabled }),
    },
  ),
)

export const useDemoMode = () => useDemoModeStore((state) => DEMO_MODE_AVAILABLE && state.enabled)

export const initDemoMode = async () => {
  if (DEMO_MODE_AVAILABLE && useDemoModeStore.getState().enabled) {
    await startMockWorker()
  }
}
