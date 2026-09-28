// `moduleDetection: force` turns every file into a module, so augment globals explicitly
declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- declaration merging needs an interface
  interface ImportMetaEnv {
    readonly VITE_API_MOCKS?: 'true' | 'false'
    readonly VITE_DEFAULT_API_URL?: string
    readonly VITE_BASE_PATH?: string
  }
}

export {}
