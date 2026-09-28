import { render, screen } from '@testing-library/react'

import { ToastProvider } from '@/shared/ui/toast'

import { resolveErrorAsync } from '.'

describe('resolveErrorAsync', () => {
  it('shows a readable toast and returns the normalized error', async () => {
    render(<ToastProvider>{null}</ToastProvider>)

    const appError = await resolveErrorAsync(new TypeError('Failed to fetch'))

    expect(appError.kind).toBe('network')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Нет соединения с сервером GREEN-API',
    )
  })

  it('stays silent for aborted requests', async () => {
    render(<ToastProvider>{null}</ToastProvider>)

    const appError = await resolveErrorAsync(new DOMException('aborted', 'AbortError'))

    expect(appError.kind).toBe('aborted')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
