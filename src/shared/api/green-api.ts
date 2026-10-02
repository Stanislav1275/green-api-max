import { withRetry } from '@/shared/lib/async'

import { isRetryableError } from './errors'
import { createClient } from './gen/.kubb/client'
import {
  deleteNotification,
  getSettings,
  getStateInstance,
  receiveNotification,
  sendMessage,
} from './gen/clients'
import type { SendMessageRequest } from './gen/types'

export type GreenApiCredentials = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

/** Every request is cut off after this; a hanging socket becomes a "server did not respond" error. */
export const REQUEST_TIMEOUT_MS = 30_000

/** Long-poll window for `receiveNotification`; must stay well below the request timeout. */
export const RECEIVE_TIMEOUT_SECONDS = 20

const RETRY = { retries: 3, baseDelayMs: 500, maxDelayMs: 8_000, shouldRetry: isRetryableError }

/** Caller cancellation (unmount, sign out) combined with the built-in timeout. */
const withTimeout = (signal?: AbortSignal) => {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  return signal ? AbortSignal.any([signal, timeout]) : timeout
}

export const createGreenApi = ({ apiUrl, idInstance, apiTokenInstance }: GreenApiCredentials) => {
  const client = createClient({ baseURL: apiUrl.replace(/\/+$/, '') })
  const path = { idInstance, apiTokenInstance }

  return {
    getStateInstance: (signal?: AbortSignal) =>
      withRetry(() => getStateInstance({ client, path, signal: withTimeout(signal) }).unwrap(), {
        ...RETRY,
        signal,
      }),

    getSettings: (signal?: AbortSignal) =>
      withRetry(() => getSettings({ client, path, signal: withTimeout(signal) }).unwrap(), {
        ...RETRY,
        signal,
      }),

    /** not retried: POST is not idempotent, a retry could deliver the message twice */
    sendMessage: (body: SendMessageRequest) =>
      sendMessage({ client, path, body, signal: withTimeout() }).unwrap(),

    /** not retried here: the polling loop owns its own backoff */
    receiveNotification: (signal?: AbortSignal) =>
      receiveNotification({
        client,
        path,
        query: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
        signal: withTimeout(signal),
      }).unwrap(),

    /** idempotent: deleting twice just returns `result: false` */
    deleteNotification: (receiptId: number, signal?: AbortSignal) =>
      withRetry(
        () =>
          deleteNotification({
            client,
            path: { ...path, receiptId },
            signal: withTimeout(signal),
          }).unwrap(),
        { ...RETRY, signal },
      ),
  }
}

export type GreenApi = ReturnType<typeof createGreenApi>
