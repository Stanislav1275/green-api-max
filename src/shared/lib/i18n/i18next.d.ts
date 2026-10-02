import 'i18next'

import type ru from './locales/ru.json'

// ru.json is the source of truth: every t('key') is checked at compile time
declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation needs an interface
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof ru }
    returnNull: false
  }
}
