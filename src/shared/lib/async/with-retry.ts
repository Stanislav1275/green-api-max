import { backoffDelay, type BackoffOptions } from './backoff'
import { sleep } from './sleep'

export type RetryOptions = BackoffOptions & {
  /** extra attempts after the first one */
  retries: number
  shouldRetry: (error: unknown) => boolean
  signal?: AbortSignal
}

/** Runs `task`, retrying retryable failures with progressive backoff. */
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
