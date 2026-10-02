import * as z from 'zod'

// the token travels in the URL path, so only HTTPS and GREEN-API's own hosts (matches the CSP)
const GREEN_API_HOST = /(^|\.)green-?api\.com$/

export const credentialsSchema = z.object({
  apiUrl: z
    .url({ protocol: /^https$/, hostname: GREEN_API_HOST, error: 'validation.apiUrl' })
    .transform((url) => url.replace(/\/+$/, ''))
    .prefault(''),
  idInstance: z.string().trim().regex(/^\d+$/, 'validation.idInstance').prefault(''),
  apiTokenInstance: z.string().trim().min(1, 'validation.apiTokenInstance').prefault(''),
})

export type CredentialsInput = z.input<typeof credentialsSchema>
export type Credentials = z.output<typeof credentialsSchema>
