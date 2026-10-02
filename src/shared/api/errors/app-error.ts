export type AppError =
  | { kind: 'validation'; message: string; fields: Record<string, string> }
  /** a known non-2xx status with a human message */
  | { kind: 'http'; status: number; message: string }
  | { kind: 'network'; message: string }
  /** no response within the request timeout */
  | { kind: 'timeout'; message: string }
  /** cancelled by us (unmount, sign out) — never shown */
  | { kind: 'aborted'; message: string }
  /** anything we could not recognise */
  | { kind: 'unknown'; message: string }

export const UNKNOWN_ERROR_MESSAGE = 'errors.unknown'
