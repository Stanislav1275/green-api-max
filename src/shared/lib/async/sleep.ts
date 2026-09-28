/** Resolves after `ms`, or immediately when `signal` aborts. Never rejects. */
export const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        resolve()
      },
      { once: true },
    )
  })

/** Yields to the macrotask queue so rendering and input are never starved by a hot loop. */
export const yieldToEventLoop = () => sleep(0)
