const start = vi.fn(() => Promise.resolve())
const setupWorker = vi.fn(() => ({ start }))

vi.mock('msw/browser', () => ({ setupWorker }))

describe('enableMocking', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('does nothing unless VITE_API_MOCKS=true', async () => {
    vi.stubEnv('VITE_API_MOCKS', 'false')
    const { enableMocking } = await import('./enable-mocking')

    await enableMocking()

    expect(setupWorker).not.toHaveBeenCalled()
  })

  it('starts the MSW worker from the app base path in demo mode', async () => {
    vi.stubEnv('VITE_API_MOCKS', 'true')
    vi.stubEnv('BASE_URL', '/green-api-max/')
    const { enableMocking } = await import('./enable-mocking')

    await enableMocking()

    expect(setupWorker).toHaveBeenCalledTimes(1)
    expect(start).toHaveBeenCalledWith({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/green-api-max/mockServiceWorker.js' },
    })
  })
})
