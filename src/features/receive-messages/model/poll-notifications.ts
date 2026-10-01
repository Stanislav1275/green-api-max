import type { GreenApi, NotificationBody } from '@/shared/api'
import { backoffDelay, type BackoffOptions, sleep, yieldToEventLoop } from '@/shared/lib/async'

const MIN_EMPTY_POLL_MS = 250

const DEFAULT_BACKOFF: BackoffOptions = { baseDelayMs: 1_000, maxDelayMs: 30_000 }

type PollOptions = {
  api: Pick<GreenApi, 'receiveNotification' | 'deleteNotification'>
  signal: AbortSignal
  onNotification: (body: NotificationBody) => void
  onError?: (error: unknown) => void
  backoff?: BackoffOptions
}

export const pollNotifications = async ({
  api,
  signal,
  onNotification,
  onError,
  backoff = DEFAULT_BACKOFF,
}: PollOptions) => {
  let failures = 0
  let lastReceiptId: number | null = null
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
