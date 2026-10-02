export type BackoffOptions = {
  baseDelayMs: number
  maxDelayMs: number
  random?: () => number
}

export const backoffDelay = (
  attempt: number,
  { baseDelayMs, maxDelayMs, random = Math.random }: BackoffOptions,
) => {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt)
  return Math.round(ceiling / 2 + (ceiling / 2) * random())
}
