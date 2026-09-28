export type BackoffOptions = {
  baseDelayMs: number
  maxDelayMs: number
  /** injectable for deterministic tests */
  random?: () => number
}

/**
 * Progressive delay with "equal jitter": `min(max, base · 2^attempt)` scaled into [50%, 100%],
 * so many clients recovering at once do not hit the server in the same instant.
 */
export const backoffDelay = (
  attempt: number,
  { baseDelayMs, maxDelayMs, random = Math.random }: BackoffOptions,
) => {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt)
  return Math.round(ceiling / 2 + (ceiling / 2) * random())
}
