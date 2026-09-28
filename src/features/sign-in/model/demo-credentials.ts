import type { Credentials } from '@/entities/session'

/** Demo mode serves GREEN-API from an MSW mock, so any well-formed credentials work. */
export const DEMO_CREDENTIALS: Credentials = {
  apiUrl: 'https://api.green-api.com/v3',
  idInstance: '3100000001',
  apiTokenInstance: 'demo-token',
}
