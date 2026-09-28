import * as z from 'zod'

import { sendMessageRequestSchema } from '@/shared/api'

const { message } = sendMessageRequestSchema.shape

/** Limit comes from the OpenAPI spec (via Kubb); the client adds trimming and "not empty". */
export const MAX_MESSAGE_LENGTH = message.maxLength ?? 4000

export const sendMessageSchema = z.object({
  text: message.trim().min(1, 'Введите сообщение'),
})

export type SendMessageValues = z.infer<typeof sendMessageSchema>
