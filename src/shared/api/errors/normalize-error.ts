import * as z from 'zod'

import { ResponseError } from '../gen/.kubb/client'
import { type AppError, UNKNOWN_ERROR_MESSAGE } from './app-error'

/** translation keys (errors.status.*) for statuses with a known meaning */
const KNOWN_STATUSES = new Set([400, 401, 403, 404, 429, 466])

/**
 * Client-side contract for error bodies. GREEN-API is not consistent here,
 * so every field is optional and field errors are accepted as a map or a list.
 */
const errorBodySchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  details: z.string().optional(),
  errors: z
    .union([
      z.record(z.string(), z.union([z.string(), z.array(z.string())])),
      z.array(z.object({ field: z.string(), message: z.string() })),
    ])
    .optional(),
})

type ErrorBody = z.infer<typeof errorBodySchema>

const toFieldErrors = (errors: ErrorBody['errors']): Record<string, string> => {
  if (!errors) {
    return {}
  }
  if (Array.isArray(errors)) {
    return Object.fromEntries(errors.map(({ field, message }) => [field, message]))
  }
  return Object.fromEntries(
    Object.entries(errors).map(([field, message]) => [
      field,
      Array.isArray(message) ? message.join(', ') : message,
    ]),
  )
}

const parseBody = async (data: unknown): Promise<ErrorBody | null> => {
  const raw: unknown = data instanceof Response ? await data.json().catch(() => null) : data
  const parsed = errorBodySchema.safeParse(raw)
  return parsed.success ? parsed.data : null
}

const fromResponse = (status: number, body: ErrorBody | null): AppError => {
  const fields = toFieldErrors(body?.errors)
  const serverMessage = body?.message ?? body?.details ?? body?.error

  if ((status === 400 || status === 422) && Object.keys(fields).length > 0) {
    return { kind: 'validation', message: serverMessage ?? 'errors.checkFields', fields }
  }
  const message = KNOWN_STATUSES.has(status)
    ? `errors.status.${status}`
    : status >= 500
      ? 'errors.server'
      : null
  if (message) {
    return {
      kind: 'http',
      status,
      message: status === 400 && serverMessage ? serverMessage : message,
    }
  }
  return { kind: 'unknown', message: UNKNOWN_ERROR_MESSAGE }
}

/** Turns anything thrown by a request into one of a few shapes the UI knows how to show. */
export const normalizeError = async (error: unknown): Promise<AppError> => {
  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return { kind: 'timeout', message: 'errors.timeout' }
  }
  if (error instanceof DOMException && error.name === 'AbortError') {
    return { kind: 'aborted', message: error.message }
  }
  if (error instanceof ResponseError) {
    return fromResponse(error.status, await parseBody(error.data))
  }
  if (error instanceof Response) {
    return fromResponse(error.status, await parseBody(error))
  }
  // fetch rejects with a TypeError when the host is unreachable or CORS fails
  if (error instanceof TypeError) {
    return {
      kind: 'network',
      message: 'errors.network',
    }
  }
  return { kind: 'unknown', message: UNKNOWN_ERROR_MESSAGE }
}
