import * as z from 'zod'

import { getSchemaDefaults } from '.'

it('collects prefault and default values, skips fields without them', () => {
  const schema = z.object({
    text: z.string().min(1).prefault(''),
    count: z.number().default(3),
    required: z.string(),
  })

  expect(getSchemaDefaults(schema)).toEqual({ text: '', count: 3 })
})
