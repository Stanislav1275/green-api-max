import type { Credentials } from '@/entities/session'

/** Demo mode serves GREEN-API from an MSW mock, so any well-formed credentials work. */
export const IS_DEMO = import.meta.env.VITE_API_MOCKS === 'true'

export const DEMO_CREDENTIALS: Credentials = {
  apiUrl: 'https://api.green-api.com/v3',
  idInstance: '3100000001',
  apiTokenInstance: 'demo-token',
}

/** fields worth showing in the hint; apiUrl is already prefilled */
export const DEMO_HINT_FIELDS = ['idInstance', 'apiTokenInstance'] as const
