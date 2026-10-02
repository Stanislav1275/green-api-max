import * as z from 'zod'

export const credentialsSchema = z.object({
  apiUrl: z
    .url({ protocol: /^https?$/, error: 'validation.apiUrl' })
    .transform((url) => url.replace(/\/+$/, ''))
    .prefault(''),
  idInstance: z.string().trim().regex(/^\d+$/, 'validation.idInstance').prefault(''),
  apiTokenInstance: z.string().trim().min(1, 'validation.apiTokenInstance').prefault(''),
})

export type CredentialsInput = z.input<typeof credentialsSchema>
export type Credentials = z.output<typeof credentialsSchema>
