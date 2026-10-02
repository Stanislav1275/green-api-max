import { startMockWorker, stopMockWorker } from './mock-worker'

const msw = vi.hoisted(() => {
  const worker = { start: vi.fn(() => Promise.resolve()), stop: vi.fn() }
  return { worker, setupWorker: vi.fn(() => worker) }
})

vi.mock('msw/browser', () => ({ setupWorker: msw.setupWorker }))

describe('mock worker', () => {
  it('is created once, restarted on demand and stopped', async () => {
    stopMockWorker()
    expect(msw.worker.stop).not.toHaveBeenCalled()

    await startMockWorker()
    await startMockWorker()

    expect(msw.setupWorker).toHaveBeenCalledOnce()
    expect(msw.worker.start).toHaveBeenCalledTimes(2)
    expect(msw.worker.start).toHaveBeenCalledWith(
      expect.objectContaining({ serviceWorker: { url: '/mockServiceWorker.js' } }),
    )

    stopMockWorker()
    expect(msw.worker.stop).toHaveBeenCalledOnce()
  })
})
