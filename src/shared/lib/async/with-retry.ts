import { backoffDelay, type BackoffOptions } from './backoff'
import { sleep } from './sleep'

export type RetryOptions = BackoffOptions & {
  retries: number
  shouldRetry: (error: unknown) => boolean
  signal?: AbortSignal
}

export const withRetry = async <T>(
  task: () => Promise<T>,
  { retries, shouldRetry, signal, ...backoff }: RetryOptions,
): Promise<T> => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await task()
    } catch (error) {
      if (attempt >= retries || signal?.aborted === true || !shouldRetry(error)) {
        throw error
      }
      await sleep(backoffDelay(attempt, backoff), signal)
    }
  }
}
