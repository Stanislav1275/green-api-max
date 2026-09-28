export type AppError =
  /** the server rejected input; `fields` maps request field → message */
  | { kind: 'validation'; message: string; fields: Record<string, string> }
  /** a known non-2xx status with a human message */
  | { kind: 'http'; status: number; message: string }
  | { kind: 'network'; message: string }
  /** cancelled by us (unmount, sign out) — never shown */
  | { kind: 'aborted'; message: string }
  /** anything we could not recognise */
  | { kind: 'unknown'; message: string }

export const UNKNOWN_ERROR_MESSAGE = 'Произошла неизвестная серверная ошибка'
