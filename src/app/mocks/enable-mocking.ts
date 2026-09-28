/**
 * Demo mode (`VITE_API_MOCKS=true`): GREEN-API is served by an in-browser MSW worker,
 * so the chat works end-to-end without a real instance.
 */
export const enableMocking = async () => {
  if (import.meta.env.VITE_API_MOCKS !== 'true') {
    return
  }
  const [{ setupWorker }, { createGreenApiMock }] = await Promise.all([
    import('msw/browser'),
    import('@/shared/mocks'),
  ])
  await setupWorker(...createGreenApiMock().handlers).start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
  })
}
