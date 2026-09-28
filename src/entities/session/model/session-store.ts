import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Credentials } from './credentials'

type SessionState = {
  credentials: Credentials | null
  signIn: (credentials: Credentials) => void
  signOut: () => void
}

/**
 * Credentials live in localStorage so a reload keeps the user signed in.
 * Trade-off: the token survives a closed tab; swap to `sessionStorage` to shorten its lifetime.
 */
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
