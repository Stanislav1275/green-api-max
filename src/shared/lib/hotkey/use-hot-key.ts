import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useEffectEvent } from 'react'

import { matchesHotKey } from './match-hot-key'

export type HotKeyHandler = (event: KeyboardEvent) => void

export type HotKeyOptions = {
  /** @default true */
  preventDefault?: boolean
}

/** `['Enter', submit]`, `[['Mod+Enter', 'Ctrl+S'], save, { preventDefault: false }]` */
export type HotKeyBinding = readonly [
  combo: string | readonly string[],
  handler: HotKeyHandler,
  options?: HotKeyOptions,
]

type UseHotKeyOptions = {
  /** listen on `window` instead of returning an element `onKeyDown` */
  global?: boolean
}

const handleBindings = (bindings: readonly HotKeyBinding[], event: KeyboardEvent) => {
  // never hijack keys while an IME is composing (Chinese, Japanese, Korean input)
  if (event.isComposing) {
    return
  }
  const binding = bindings.find(([combo]) =>
    (typeof combo === 'string' ? [combo] : combo).some((key) => matchesHotKey(event, key)),
  )
  if (!binding) {
    return
  }
  const [, handler, { preventDefault = true } = {}] = binding
  if (preventDefault) {
    event.preventDefault()
  }
  handler(event)
}

/**
 * Keyboard shortcuts from a list of `[combo, handler, options?]` bindings; the first match wins.
 * Returns an `onKeyDown` for an element, or listens on `window` with `{ global: true }`.
 */
export const useHotKey = <TElement extends Element = Element>(
  bindings: readonly HotKeyBinding[],
  { global = false }: UseHotKeyOptions = {},
) => {
  // latest bindings without re-subscribing the window listener on every render
  const onWindowKeyDown = useEffectEvent((event: KeyboardEvent) => {
    handleBindings(bindings, event)
  })

  useEffect(() => {
    if (!global) {
      return
    }
    const listener = (event: KeyboardEvent) => {
      onWindowKeyDown(event)
    }
    window.addEventListener('keydown', listener)
    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [global])

  return (event: ReactKeyboardEvent<TElement>) => {
    handleBindings(bindings, event.nativeEvent)
  }
}
