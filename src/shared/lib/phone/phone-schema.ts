import * as z from 'zod'

import { normalizePhone } from './phone'

/** Client-side phone field: accepts any human formatting, outputs international digits. */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'validation.phoneRequired')
  .transform((value, context) => {
    const phone = normalizePhone(value)
    if (!phone) {
      context.addIssue({ code: 'custom', message: 'validation.phoneFormat' })
      return z.NEVER
    }
    return phone
  })
