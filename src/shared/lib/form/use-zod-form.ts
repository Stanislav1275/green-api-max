import { zodResolver } from '@hookform/resolvers/zod'
import { type DefaultValues, type Resolver, useForm, type UseFormProps } from 'react-hook-form'
import type * as z from 'zod'

import { getSchemaDefaults } from './get-schema-defaults'

type ZodFormOptions<TSchema extends z.ZodObject> = Omit<
  UseFormProps<z.input<TSchema>, unknown, z.output<TSchema>>,
  'resolver' | 'defaultValues'
> & {
  defaultValues?: Partial<z.input<TSchema>>
}

export const useZodForm = <TSchema extends z.ZodObject>(
  schema: TSchema,
  { defaultValues, ...options }: ZodFormOptions<TSchema> = {},
) =>
  useForm<z.input<TSchema>, unknown, z.output<TSchema>>({
    ...options,
    resolver: zodResolver(schema) as unknown as Resolver<
      z.input<TSchema>,
      unknown,
      z.output<TSchema>
    >,
    defaultValues: { ...getSchemaDefaults(schema), ...defaultValues } as DefaultValues<
      z.input<TSchema>
    >,
  })
