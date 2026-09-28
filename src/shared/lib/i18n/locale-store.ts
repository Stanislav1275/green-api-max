import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const LOCALES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
] as const

export type Locale = (typeof LOCALES)[number]['value']

type LocaleState = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const syncDocumentLang = (locale: Locale) => {
  document.documentElement.lang = locale
}

/** Chosen UI language; translations read it (see the i18n task), `<html lang>` follows it. */
export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'ru',
      setLocale: (locale) => {
        set({ locale })
        syncDocumentLang(locale)
      },
    }),
    {
      name: 'green-api-max/locale',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ locale }) => ({ locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncDocumentLang(state.locale)
        }
      },
    },
  ),
)
