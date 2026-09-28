import type { GreenApi, NotificationBody } from '@/shared/api'

const RECEIVE_TIMEOUT_SECONDS = 20
const MAX_BACKOFF_MS = 30_000

type PollOptions = {
  api: Pick<GreenApi, 'receiveNotification' | 'deleteNotification'>
  signal: AbortSignal
  onNotification: (body: NotificationBody) => void
  onError?: (error: unknown) => void
}

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })

/**
 * GREEN-API HTTP API long polling. One notification per request, strictly sequential:
 * every notification — even one we ignore — must be deleted, otherwise the FIFO queue stalls on it.
 */
export const pollNotifications = async ({ api, signal, onNotification, onError }: PollOptions) => {
  let failures = 0
  // a function, not a property read: TS would narrow `signal.aborted` to `false` inside the loop
  const isAborted = () => signal.aborted

  while (!isAborted()) {
    try {
      const notification = await api.receiveNotification(RECEIVE_TIMEOUT_SECONDS, signal)
      if (notification) {
        try {
          onNotification(notification.body)
        } finally {
          await api.deleteNotification(notification.receiptId)
        }
      }
      failures = 0
    } catch (error) {
      if (isAborted()) {
        return
      }
      failures += 1
      onError?.(error)
      await sleep(Math.min(1000 * 2 ** failures, MAX_BACKOFF_MS), signal)
    }
  }
}
