import '@tanstack/react-query'

declare module '@tanstack/react-query' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation needs an interface
  interface Register {
    mutationMeta: {
      /** the caller resolves errors itself (e.g. into form fields) — skip the global toast */
      manualErrorHandling?: boolean
    }
  }
}
