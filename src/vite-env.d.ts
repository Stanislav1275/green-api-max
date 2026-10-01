declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- declaration merging needs an interface
  interface ImportMetaEnv {
    readonly VITE_DEMO_MODE?: 'off' | 'available' | 'on'
    readonly VITE_DEFAULT_API_URL?: string
    readonly VITE_BASE_PATH?: string
  }
}

export {}
