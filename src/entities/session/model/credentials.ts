import * as z from 'zod'

export const credentialsSchema = z.object({
  apiUrl: z
    .url({ protocol: /^https?$/, error: 'Укажите apiUrl из личного кабинета' })
    .transform((url) => url.replace(/\/+$/, ''))
    .prefault(''),
  idInstance: z.string().trim().regex(/^\d+$/, 'idInstance состоит только из цифр').prefault(''),
  apiTokenInstance: z.string().trim().min(1, 'Укажите apiTokenInstance').prefault(''),
})

export type CredentialsInput = z.input<typeof credentialsSchema>
export type Credentials = z.output<typeof credentialsSchema>
