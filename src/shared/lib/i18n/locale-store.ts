import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { i18n } from './i18n'

export const LOCALES = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
] as const

export type Locale = (typeof LOCALES)[number]['value']

type LocaleState = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const applyLocale = (locale: Locale) => {
  void i18n.changeLanguage(locale)
  document.documentElement.lang = locale
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'ru',
      setLocale: (locale) => {
        set({ locale })
        applyLocale(locale)
      },
    }),
    {
      name: 'green-api-max/locale',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ locale }) => ({ locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyLocale(state.locale)
        }
      },
    },
  ),
)
