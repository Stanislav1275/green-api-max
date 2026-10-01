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

export const REQUEST_TIMEOUT_MS = 30_000

export const RECEIVE_TIMEOUT_SECONDS = 20

const RETRY = { retries: 3, baseDelayMs: 500, maxDelayMs: 8_000, shouldRetry: isRetryableError }

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

    sendMessage: (body: SendMessageRequest) =>
      sendMessage({ client, path, body, signal: withTimeout() }).unwrap(),

    receiveNotification: (signal?: AbortSignal) =>
      receiveNotification({
        client,
        path,
        query: { receiveTimeout: RECEIVE_TIMEOUT_SECONDS },
        signal: withTimeout(signal),
      }).unwrap(),

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
