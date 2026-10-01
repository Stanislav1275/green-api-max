import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Credentials } from './credentials'

type SessionState = {
  credentials: Credentials | null
  signIn: (credentials: Credentials) => void
  signOut: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      signIn: (credentials) => {
        set({ credentials })
      },
      signOut: () => {
        set({ credentials: null })
      },
    }),
    {
      name: 'green-api-max/session',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ credentials }) => ({ credentials }),
    },
  ),
)

export const useCredentials = () => useSessionStore((state) => state.credentials)
