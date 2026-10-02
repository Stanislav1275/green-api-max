import { screen } from '@testing-library/react'

import { renderApp } from './render-app'

vi.hoisted(() => {
  vi.stubEnv('VITE_DEMO_MODE', 'available')
})

// jsdom has no service workers; GREEN-API is already served by the test MSW server
const worker = vi.hoisted(() => ({ start: vi.fn(() => Promise.resolve()), stop: vi.fn() }))

vi.mock('msw/browser', () => ({ setupWorker: () => worker }))

describe('US-8: демо-режим', () => {
  it('TC-8.1: колба включает демо, «Подставить» заполняет форму', async () => {
    const { user } = renderApp()
    const toggle = screen.getByRole('button', { name: 'Демо-режим' })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(toggle)

    expect(worker.start).toHaveBeenCalledOnce()
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Подставить' }))
    expect(screen.getByLabelText('idInstance')).toHaveValue('3100000001')
    expect(screen.getByRole('button', { name: 'Войти' })).toBeEnabled()
  })

  it('TC-8.2: повторное нажатие выключает демо', async () => {
    const { user } = renderApp()
    const toggle = screen.getByRole('button', { name: 'Демо-режим' })

    await user.click(toggle)
    await user.click(toggle)

    expect(worker.stop).toHaveBeenCalledOnce()
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByRole('button', { name: 'Подставить' })).not.toBeInTheDocument()
  })
})
