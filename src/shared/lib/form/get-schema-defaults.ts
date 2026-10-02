import * as z from 'zod'

/**
 * Reads form `defaultValues` from a zod object schema, so defaults live next to the rules.
 * Prefer `.prefault()` in form schemas: unlike `.default()` it runs the value through
 * validation, so `z.string().min(1).prefault('')` still rejects an empty field.
 */
export const getSchemaDefaults = <TSchema extends z.ZodObject>(schema: TSchema) =>
  Object.fromEntries(
    Object.entries(schema.shape).flatMap(([key, field]) =>
      field instanceof z.ZodPrefault || field instanceof z.ZodDefault
        ? [[key, field.def.defaultValue]]
        : [],
    ),
  ) as Partial<z.input<TSchema>>
