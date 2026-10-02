const worker = vi.hoisted(() => ({
  start: vi.fn(() => Promise.resolve()),
  stop: vi.fn(),
}))

vi.mock('./mock-worker', () => ({ startMockWorker: worker.start, stopMockWorker: worker.stop }))

const load = async (mode: string | undefined) => {
  vi.resetModules()
  // stores of the previous test persist their reset state after the global cleanup
  localStorage.clear()
  vi.stubEnv('VITE_DEMO_MODE', mode)
  return import('./demo-mode-store')
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('demo mode store', () => {
  it('is off without VITE_DEMO_MODE', async () => {
    const { DEMO_MODE_AVAILABLE, initDemoMode } = await load(undefined)
    await initDemoMode()

    expect(DEMO_MODE_AVAILABLE).toBe(false)
    expect(worker.start).not.toHaveBeenCalled()
  })

  it('"available" shows the toggle but starts switched off', async () => {
    const { DEMO_MODE_AVAILABLE, useDemoModeStore, initDemoMode } = await load('available')
    await initDemoMode()

    expect(DEMO_MODE_AVAILABLE).toBe(true)
    expect(useDemoModeStore.getState().enabled).toBe(false)
    expect(worker.start).not.toHaveBeenCalled()
  })

  it('"on" starts the mock before the first render', async () => {
    const { useDemoModeStore, initDemoMode } = await load('on')
    await initDemoMode()

    expect(useDemoModeStore.getState().enabled).toBe(true)
    expect(worker.start).toHaveBeenCalledOnce()
  })

  it('keeps demo off when the mock fails to start', async () => {
    const { useDemoModeStore } = await load('available')
    worker.start.mockRejectedValueOnce(new Error('no service worker'))

    await expect(useDemoModeStore.getState().setEnabled(true)).rejects.toThrow('no service worker')
    expect(useDemoModeStore.getState()).toMatchObject({ enabled: false, pending: false })
  })
})
