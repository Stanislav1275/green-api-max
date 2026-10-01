import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useEffectEvent } from 'react'

import { matchesHotKey } from './match-hot-key'

export type HotKeyOptions = {
  preventDefault?: boolean
}

export type HotKeyBinding<TEvent> = readonly [
  combo: string | readonly string[],
  handler: (event: TEvent) => void,
  options?: HotKeyOptions,
]

const handleBindings = <TEvent extends { preventDefault: () => void }>(
  bindings: readonly HotKeyBinding<TEvent>[],
  event: TEvent,
  nativeEvent: KeyboardEvent,
) => {
  if (nativeEvent.isComposing) {
    return
  }
  const binding = bindings.find(([combo]) =>
    (typeof combo === 'string' ? [combo] : combo).some((key) => matchesHotKey(nativeEvent, key)),
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

// eslint-disable-next-line @eslint-react/no-unnecessary-use-prefix -- paired with useGlobalHotKey, called in render
export const useHotKey =
  <TElement extends Element>(bindings: readonly HotKeyBinding<ReactKeyboardEvent<TElement>>[]) =>
  (event: ReactKeyboardEvent<TElement>) => {
    handleBindings(bindings, event, event.nativeEvent)
  }

export const useGlobalHotKey = (bindings: readonly HotKeyBinding<KeyboardEvent>[]) => {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    handleBindings(bindings, event, event)
  })

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      onKeyDown(event)
    }
    window.addEventListener('keydown', listener)
    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [])
}
