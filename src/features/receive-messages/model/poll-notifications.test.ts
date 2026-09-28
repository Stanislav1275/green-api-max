import type { GreenApi, Notification } from '@/shared/api'

import { pollNotifications } from './poll-notifications'

const notification = (
  receiptId: number,
  typeWebhook = 'incomingMessageReceived',
): Notification => ({
  receiptId,
  body: { typeWebhook, timestamp: receiptId },
})

type Step = Notification | null | Error

const BACKOFF = { baseDelayMs: 1_000, maxDelayMs: 30_000, random: () => 1 }

/** Fake GREEN-API serving `steps` in order; the loop is aborted once they run out. */
const fakeApi = (steps: Step[], controller: AbortController) => {
  const queue = [...steps]
  return {
    receiveNotification: vi.fn<GreenApi['receiveNotification']>(() => {
      const step = queue.shift()
      if (queue.length === 0) {
        controller.abort()
      }
      return step instanceof Error ? Promise.reject(step) : Promise.resolve(step ?? null)
    }),
    deleteNotification: vi.fn<GreenApi['deleteNotification']>(() =>
      Promise.resolve({ result: true }),
    ),
  }
}

describe('pollNotifications', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('handles and deletes every notification in FIFO order, including ignored ones', async () => {
    const controller = new AbortController()
    const api = fakeApi(
      [notification(1, 'stateInstanceChanged'), null, notification(2), null],
      controller,
    )
    const onNotification = vi.fn()

    const loop = pollNotifications({ api, signal: controller.signal, onNotification })
    await vi.runAllTimersAsync()
    await loop

    expect(
      onNotification.mock.calls.map(([body]) => (body as { timestamp: number }).timestamp),
    ).toEqual([1, 2])
    expect(api.deleteNotification.mock.calls).toEqual([
      [1, controller.signal],
      [2, controller.signal],
    ])
    expect(api.receiveNotification).toHaveBeenCalledWith(controller.signal)
  })

  it('deletes a notification even when handling it throws', async () => {
    const controller = new AbortController()
    const api = fakeApi([notification(7), null], controller)
    const onError = vi.fn()

    const loop = pollNotifications({
      api,
      signal: controller.signal,
      backoff: BACKOFF,
      onNotification: () => {
        throw new Error('bad payload')
      },
      onError,
    })
    await vi.runAllTimersAsync()
    await loop

    expect(api.deleteNotification).toHaveBeenCalledWith(7, controller.signal)
    expect(onError).toHaveBeenCalledWith(new Error('bad payload'))
  })

  it('backs off progressively after failures and recovers', async () => {
    const controller = new AbortController()
    const api = fakeApi(
      [new Error('offline'), new Error('offline'), notification(3), null],
      controller,
    )
    const onError = vi.fn()
    const onNotification = vi.fn()

    const loop = pollNotifications({
      api,
      signal: controller.signal,
      backoff: BACKOFF,
      onNotification,
      onError,
    })

    await vi.advanceTimersByTimeAsync(999)
    expect(api.receiveNotification).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(2)
    expect(api.receiveNotification).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(1_998)
    expect(api.receiveNotification).toHaveBeenCalledTimes(2)
    await vi.runAllTimersAsync()
    await loop

    expect(onError).toHaveBeenCalledTimes(2)
    expect(onNotification).toHaveBeenCalledTimes(1)
  })

  it('caps the backoff and uses jitter by default', async () => {
    const controller = new AbortController()
    const api = fakeApi(
      [...Array.from({ length: 7 }, () => new Error('offline')), null],
      controller,
    )

    const loop = pollNotifications({ api, signal: controller.signal, onNotification: vi.fn() })
    // with default jitter every pause is between 50% and 100% of 1, 2, 4, 8, 16, 30, 30 seconds
    await vi.advanceTimersByTimeAsync(45_500)
    expect(api.receiveNotification.mock.calls.length).toBeGreaterThanOrEqual(6)
    await vi.runAllTimersAsync()
    await loop

    expect(api.receiveNotification).toHaveBeenCalledTimes(8)
  })

  it('rate limits empty responses when the server ignores long polling', async () => {
    const controller = new AbortController()
    const api = fakeApi([null, null, null, null, null], controller)

    const loop = pollNotifications({ api, signal: controller.signal, onNotification: vi.fn() })

    await vi.advanceTimersByTimeAsync(1_000)
    // at most one request per 250 ms instead of a busy loop
    expect(api.receiveNotification.mock.calls.length).toBeLessThanOrEqual(5)
    await vi.runAllTimersAsync()
    await loop
  })

  it('backs off when the same notification keeps coming back', async () => {
    const controller = new AbortController()
    const stuck = notification(9)
    const api = fakeApi([stuck, stuck, stuck, notification(10), null], controller)
    const onNotification = vi.fn()
    const onError = vi.fn()

    const loop = pollNotifications({
      api,
      signal: controller.signal,
      backoff: BACKOFF,
      onNotification,
      onError,
    })
    await vi.runAllTimersAsync()
    await loop

    expect(onNotification).toHaveBeenCalledTimes(2)
    expect(onError).toHaveBeenCalledTimes(2)
    expect(onError).toHaveBeenCalledWith(new Error('Notification 9 is stuck in the queue'))
    expect(api.deleteNotification).toHaveBeenCalledTimes(4)
  })

  it('stops quietly when aborted during a request or a backoff pause', async () => {
    const controller = new AbortController()
    const onError = vi.fn()
    const api = {
      receiveNotification: vi.fn(() => Promise.reject(new Error('offline'))),
      deleteNotification: vi.fn(),
    }

    const loop = pollNotifications({
      api,
      signal: controller.signal,
      backoff: BACKOFF,
      onNotification: vi.fn(),
      onError,
    })
    await vi.advanceTimersByTimeAsync(500)
    controller.abort()
    await vi.runAllTimersAsync()
    await loop

    expect(onError).toHaveBeenCalledTimes(1)
    expect(api.receiveNotification).toHaveBeenCalledTimes(1)

    const aborted = new AbortController()
    const rejectOnAbort = {
      receiveNotification: vi.fn(() => {
        aborted.abort()
        return Promise.reject(new DOMException('aborted', 'AbortError'))
      }),
      deleteNotification: vi.fn(),
    }
    await pollNotifications({
      api: rejectOnAbort,
      signal: aborted.signal,
      onNotification: vi.fn(),
      onError,
    })
    expect(onError).toHaveBeenCalledTimes(1)
  })
})
