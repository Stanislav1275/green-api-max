import type { GreenApi, NotificationBody } from '@/shared/api'
import { backoffDelay, type BackoffOptions, sleep, yieldToEventLoop } from '@/shared/lib/async'

/** A server that ignores long polling must not turn the loop into a busy one. */
const MIN_EMPTY_POLL_MS = 250

const DEFAULT_BACKOFF: BackoffOptions = { baseDelayMs: 1_000, maxDelayMs: 30_000 }

type PollOptions = {
  api: Pick<GreenApi, 'receiveNotification' | 'deleteNotification'>
  signal: AbortSignal
  onNotification: (body: NotificationBody) => void
  onError?: (error: unknown) => void
  backoff?: BackoffOptions
}

/**
 * GREEN-API HTTP API long polling. One notification per request, strictly sequential:
 * every notification — even one we ignore — must be deleted, otherwise the FIFO queue stalls on it.
 *
 * Event-loop safety: each turn yields a macrotask, empty responses are rate limited,
 * and failures (including a notification that keeps coming back) back off progressively.
 */
export const pollNotifications = async ({
  api,
  signal,
  onNotification,
  onError,
  backoff = DEFAULT_BACKOFF,
}: PollOptions) => {
  let failures = 0
  let lastReceiptId: number | null = null
  // a function, not a property read: TS would narrow `signal.aborted` to `false` inside the loop
  const isAborted = () => signal.aborted

  const pause = async (error: unknown) => {
    failures += 1
    onError?.(error)
    await sleep(backoffDelay(failures - 1, backoff), signal)
  }

  while (!isAborted()) {
    const startedAt = Date.now()
    try {
      const notification = await api.receiveNotification(signal)

      if (!notification) {
        failures = 0
        await sleep(Math.max(0, MIN_EMPTY_POLL_MS - (Date.now() - startedAt)), signal)
      } else if (notification.receiptId === lastReceiptId) {
        // deletion did not take effect; don't re-process it in a tight loop
        await api.deleteNotification(notification.receiptId, signal)
        await pause(new Error(`Notification ${notification.receiptId} is stuck in the queue`))
      } else {
        lastReceiptId = notification.receiptId
        try {
          onNotification(notification.body)
        } finally {
          await api.deleteNotification(notification.receiptId, signal)
        }
        failures = 0
      }
    } catch (error) {
      if (isAborted()) {
        return
      }
      await pause(error)
    }
    await yieldToEventLoop()
  }
}
