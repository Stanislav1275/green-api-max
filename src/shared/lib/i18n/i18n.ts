import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ru from './locales/ru.json'

export const resources = { ru: { translation: ru }, en: { translation: en } } as const

export const i18n = i18next.createInstance()

void i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
  nsSeparator: false,
  returnNull: false,
  initAsync: false,
})

export const translate = (keyOrText: string): string =>
  i18n.exists(keyOrText) ? (i18n.t as (key: string) => string)(keyOrText) : keyOrText
