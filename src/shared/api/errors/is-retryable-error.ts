import { ResponseError } from '../gen/.kubb/client'

export const isRetryableError = (error: unknown) => {
  if (error instanceof ResponseError) {
    return error.status === 429 || error.status >= 500
  }
  if (error instanceof DOMException) {
    return error.name === 'TimeoutError'
  }
  return error instanceof TypeError
}
