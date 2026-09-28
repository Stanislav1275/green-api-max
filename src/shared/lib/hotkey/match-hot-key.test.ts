import { matchesHotKey, parseHotKey } from '.'

const key = (
  value: string,
  modifiers: Partial<Record<'ctrl' | 'meta' | 'alt' | 'shift', boolean>> = {},
) => ({
  key: value,
  ctrlKey: modifiers.ctrl ?? false,
  metaKey: modifiers.meta ?? false,
  altKey: modifiers.alt ?? false,
  shiftKey: modifiers.shift ?? false,
})

describe('parseHotKey', () => {
  it('reads aliases case-insensitively', () => {
    expect(parseHotKey('Control+Option+Cmd+Shift+K')).toEqual({
      key: 'k',
      ctrl: true,
      meta: true,
      alt: true,
      shift: true,
    })
  })

  it('throws on an unknown modifier', () => {
    expect(() => parseHotKey('Hyper+K')).toThrow('Unknown modifier "hyper" in hot key "Hyper+K"')
  })

  it('maps Mod to Ctrl outside Apple devices', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (X11; Linux x86_64)')
    expect(parseHotKey('Mod+S')).toMatchObject({ ctrl: true, meta: false })
  })

  it('maps Mod to ⌘ on Apple devices', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    )
    expect(parseHotKey('Mod+S')).toMatchObject({ ctrl: false, meta: true })
  })

  it('maps Mod to Ctrl when there is no navigator (SSR)', () => {
    vi.stubGlobal('navigator', undefined)
    expect(parseHotKey('Mod+S')).toMatchObject({ ctrl: true, meta: false })
    vi.unstubAllGlobals()
  })
})

describe('matchesHotKey', () => {
  it('matches the exact combination', () => {
    expect(matchesHotKey(key('Enter'), 'Enter')).toBe(true)
    expect(matchesHotKey(key('k', { ctrl: true }), 'Ctrl+K')).toBe(true)
  })

  it('does not match when extra modifiers are held', () => {
    expect(matchesHotKey(key('Enter', { shift: true }), 'Enter')).toBe(false)
    expect(matchesHotKey(key('k', { ctrl: true, alt: true }), 'Ctrl+K')).toBe(false)
  })

  it('does not match another key', () => {
    expect(matchesHotKey(key('Escape'), 'Enter')).toBe(false)
  })
})
