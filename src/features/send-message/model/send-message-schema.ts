import * as z from 'zod'

import { sendMessageRequestSchema } from '@/shared/api'
import { invariant } from '@/shared/lib/invariant'

const { message } = sendMessageRequestSchema.shape

export const MAX_MESSAGE_LENGTH = invariant(
  message.maxLength,
  'sendMessage.message.maxLength in the OpenAPI spec',
)

export const sendMessageSchema = z.object({
  text: message.trim().min(1, 'validation.messageRequired').prefault(''),
})

export type SendMessageInput = z.input<typeof sendMessageSchema>
export type SendMessageValues = z.output<typeof sendMessageSchema>
