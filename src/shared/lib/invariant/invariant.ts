export const invariant = <T>(value: T, message: string): NonNullable<T> => {
  if (value === null || value === undefined) {
    throw new Error(`Invariant failed: ${message}`)
  }
  return value
}
