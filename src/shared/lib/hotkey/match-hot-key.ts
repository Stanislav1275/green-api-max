type KeyState = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>

type ParsedHotKey = {
  key: string
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
}

const isApple = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.userAgent)

const MODIFIER_ALIASES: Partial<Record<string, keyof Omit<ParsedHotKey, 'key'>>> = {
  ctrl: 'ctrl',
  control: 'ctrl',
  meta: 'meta',
  cmd: 'meta',
  alt: 'alt',
  option: 'alt',
  shift: 'shift',
}

/**
 * `'Mod+Shift+K'` → key + exact modifier set. `Mod` is ⌘ on Apple devices and Ctrl elsewhere.
 * Names are case-insensitive; the key is compared with `KeyboardEvent.key`.
 */
export const parseHotKey = (combo: string): ParsedHotKey => {
  const parts = combo.split('+').map((part) => part.trim().toLowerCase())
  const key = parts.pop() ?? ''
  const parsed: ParsedHotKey = { key, ctrl: false, meta: false, alt: false, shift: false }

  for (const part of parts) {
    const modifier = part === 'mod' ? (isApple() ? 'meta' : 'ctrl') : MODIFIER_ALIASES[part]
    if (!modifier) {
      throw new Error(`Unknown modifier "${part}" in hot key "${combo}"`)
    }
    parsed[modifier] = true
  }
  return parsed
}

/** Exact match: `Enter` does not fire on `Shift+Enter`. */
export const matchesHotKey = (event: KeyState, combo: string) => {
  const hotKey = parseHotKey(combo)
  return (
    event.key.toLowerCase() === hotKey.key &&
    event.ctrlKey === hotKey.ctrl &&
    event.metaKey === hotKey.meta &&
    event.altKey === hotKey.alt &&
    event.shiftKey === hotKey.shift
  )
}
