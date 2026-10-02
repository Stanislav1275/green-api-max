const MIN_DIGITS = 10
const MAX_DIGITS = 15

export const normalizePhone = (input: string): string | null => {
  if (/[^\d\s()+-]/.test(input)) {
    return null
  }
  let digits = input.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  }
  if (digits.length === 10 && digits.startsWith('9')) {
    digits = `7${digits}`
  }
  return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS ? digits : null
}

export const phoneToChatId = (phone: string) => `${phone}@c.us`

export const formatPhone = (phone: string) => {
  const match = /^7(\d{3})(\d{3})(\d{2})(\d{2})$/.exec(phone)
  return match ? `+7 ${match[1]} ${match[2]}-${match[3]}-${match[4]}` : `+${phone}`
}
