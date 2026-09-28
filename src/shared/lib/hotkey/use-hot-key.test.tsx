import { fireEvent, render, screen } from '@testing-library/react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'

import { type HotKeyBinding, useGlobalHotKey, useHotKey } from '.'

type InputBinding = HotKeyBinding<ReactKeyboardEvent<HTMLInputElement>>

const Input = ({ bindings }: { bindings: readonly InputBinding[] }) => {
  const onKeyDown = useHotKey(bindings)
  return <input aria-label="field" onKeyDown={onKeyDown} />
}

const Global = ({ bindings }: { bindings: readonly HotKeyBinding<KeyboardEvent>[] }) => {
  useGlobalHotKey(bindings)
  return null
}

describe('useHotKey', () => {
  it('calls the first matching binding with the element event and prevents default', () => {
    const first = vi.fn((event: ReactKeyboardEvent<HTMLInputElement>) => event.currentTarget.value)
    const second = vi.fn()
    render(
      <Input
        bindings={[
          [['Mod+S', 'Enter'], first],
          ['Enter', second],
        ]}
      />,
    )

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    screen.getByLabelText('field').dispatchEvent(event)

    expect(first).toHaveBeenCalledTimes(1)
    expect(first).toHaveReturnedWith('')
    expect(second).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
  })

  it('keeps the default action when preventDefault is false', () => {
    render(<Input bindings={[['Escape', vi.fn(), { preventDefault: false }]]} />)

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    screen.getByLabelText('field').dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
  })

  it('ignores unmatched keys and IME composition', () => {
    const handler = vi.fn()
    render(<Input bindings={[['Enter', handler]]} />)

    fireEvent.keyDown(screen.getByLabelText('field'), { key: 'a' })
    fireEvent.keyDown(screen.getByLabelText('field'), { key: 'Enter', isComposing: true })

    expect(handler).not.toHaveBeenCalled()
  })
})

describe('useGlobalHotKey', () => {
  it('listens on window and unsubscribes on unmount', () => {
    const handler = vi.fn()
    const { unmount } = render(<Global bindings={[['Ctrl+K', handler]]} />)

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(handler).toHaveBeenCalledTimes(1)

    unmount()
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
