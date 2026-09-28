import { backoffDelay, sleep, withRetry, yieldToEventLoop } from '.'

describe('backoffDelay', () => {
  it('doubles per attempt within [50%, 100%] and respects the cap', () => {
    const options = { baseDelayMs: 500, maxDelayMs: 4_000 }
    expect(backoffDelay(0, { ...options, random: () => 0 })).toBe(250)
    expect(backoffDelay(0, { ...options, random: () => 1 })).toBe(500)
    expect(backoffDelay(2, { ...options, random: () => 1 })).toBe(2_000)
    expect(backoffDelay(10, { ...options, random: () => 1 })).toBe(4_000)
    expect(backoffDelay(1, options)).toBeGreaterThanOrEqual(500)
  })
})

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('waits for the given time', async () => {
    const done = vi.fn()
    void sleep(100).then(done)
    await vi.advanceTimersByTimeAsync(99)
    expect(done).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(done).toHaveBeenCalled()
  })

  it('wakes up early on abort', async () => {
    const controller = new AbortController()
    const done = vi.fn()
    void sleep(10_000, controller.signal).then(done)
    controller.abort()
    await vi.advanceTimersByTimeAsync(0)
    expect(done).toHaveBeenCalled()
  })

  it('yieldToEventLoop resolves on the next macrotask', async () => {
    const done = vi.fn()
    void yieldToEventLoop().then(done)
    expect(done).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(0)
    expect(done).toHaveBeenCalled()
  })
})

describe('withRetry', () => {
  const options = { retries: 2, baseDelayMs: 100, maxDelayMs: 1_000, random: () => 1 }

  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('retries retryable errors with growing pauses', async () => {
    const task = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('503'))
      .mockRejectedValueOnce(new Error('503'))
      .mockResolvedValue('ok')

    const result = withRetry(task, { ...options, shouldRetry: () => true })
    await vi.advanceTimersByTimeAsync(100)
    expect(task).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(200)

    await expect(result).resolves.toBe('ok')
    expect(task).toHaveBeenCalledTimes(3)
  })

  it('gives up after the last retry', async () => {
    const task = vi.fn(() => Promise.reject(new Error('down')))
    const result = withRetry(task, { ...options, shouldRetry: () => true })
    const assertion = expect(result).rejects.toThrow('down')
    await vi.advanceTimersByTimeAsync(1_000)
    await assertion
    expect(task).toHaveBeenCalledTimes(3)
  })

  it('does not retry non-retryable errors or after abort', async () => {
    const task = vi.fn(() => Promise.reject(new Error('400')))
    await expect(withRetry(task, { ...options, shouldRetry: () => false })).rejects.toThrow('400')
    expect(task).toHaveBeenCalledTimes(1)

    const controller = new AbortController()
    controller.abort()
    await expect(
      withRetry(task, { ...options, shouldRetry: () => true, signal: controller.signal }),
    ).rejects.toThrow('400')
    expect(task).toHaveBeenCalledTimes(2)
  })
})
