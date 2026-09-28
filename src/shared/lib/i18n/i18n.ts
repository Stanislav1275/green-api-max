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
  // React already escapes text; double escaping would show `&amp;`
  interpolation: { escapeValue: false },
  // keys are nested objects; raw server messages may contain ':' — never treat it as a namespace
  nsSeparator: false,
  returnNull: false,
  initAsync: false,
})

/**
 * Translates a translation key, or returns the text as is — for messages that may be
 * either our key (zod, normalized errors) or raw text from the server.
 */
export const translate = (keyOrText: string): string =>
  // the key is only known at runtime, so the compile-time key check is bypassed here, and only here
  i18n.exists(keyOrText) ? (i18n.t as (key: string) => string)(keyOrText) : keyOrText
