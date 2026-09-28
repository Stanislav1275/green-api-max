import * as z from 'zod'

import { phoneSchema } from '@/shared/lib/phone'

export const createChatSchema = z.object({ phone: phoneSchema })

export type CreateChatInput = z.input<typeof createChatSchema>
export type CreateChatValues = z.output<typeof createChatSchema>
