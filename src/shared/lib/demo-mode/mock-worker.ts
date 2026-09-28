import type { SetupWorker } from 'msw/browser'

let worker: SetupWorker | null = null

/** Serves GREEN-API from the in-browser MSW mock; msw and faker load only when needed. */
export const startMockWorker = async () => {
  if (!worker) {
    const [{ setupWorker }, { createGreenApiMock }] = await Promise.all([
      import('msw/browser'),
      import('@/shared/mocks'),
    ])
    worker = setupWorker(...createGreenApiMock().handlers)
  }
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
}

export const stopMockWorker = () => {
  worker?.stop()
}
