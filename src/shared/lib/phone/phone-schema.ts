import * as z from 'zod'

import { normalizePhone } from './phone'

/** Client-side phone field: accepts any human formatting, outputs international digits. */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Введите номер телефона')
  .transform((value, context) => {
    const phone = normalizePhone(value)
    if (!phone) {
      context.addIssue({ code: 'custom', message: 'Введите номер в формате +7 999 123-45-67' })
      return z.NEVER
    }
    return phone
  })
