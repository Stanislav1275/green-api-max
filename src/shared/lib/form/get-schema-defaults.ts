import * as z from 'zod'

export const getSchemaDefaults = <TSchema extends z.ZodObject>(schema: TSchema) =>
  Object.fromEntries(
    Object.entries(schema.shape).flatMap(([key, field]) =>
      field instanceof z.ZodPrefault || field instanceof z.ZodDefault
        ? [[key, field.def.defaultValue]]
        : [],
    ),
  ) as Partial<z.input<TSchema>>
