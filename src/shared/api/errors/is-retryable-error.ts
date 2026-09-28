import { ResponseError } from '../gen/.kubb/client'

/** Transient failures worth another attempt: network, timeout, rate limit, server errors. */
export const isRetryableError = (error: unknown) => {
  if (error instanceof ResponseError) {
    return error.status === 429 || error.status >= 500
  }
  if (error instanceof DOMException) {
    return error.name === 'TimeoutError'
  }
  return error instanceof TypeError
}
