import { adapterOas } from '@kubb/adapter-oas'
import type { ResolverFile } from '@kubb/core'
import { pluginFaker } from '@kubb/plugin-faker'
import { pluginFetch } from '@kubb/plugin-fetch'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'
import { defineConfig } from 'kubb/config'

const toKebabCase = (value: string) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()

// generated files follow the project-wide kebab-case naming: send-message.ts, not SendMessage.ts
const file: ResolverFile = {
  baseName: ({ name, extname }) => `${toKebabCase(name)}${extname}`,
}
const resolver = { file }

// MSW handlers are written by hand in src/shared/api/mocks:
// @kubb/plugin-msw escapes `waInstance{idInstance}` into a literal path segment.
export default defineConfig({
  root: '.',
  input: './api/green-api.yaml',
  output: { path: './src/shared/api/gen', clean: true },
  adapter: adapterOas(),
  plugins: [
    pluginTs({ resolver }),
    pluginZod({ resolver }),
    pluginFetch({ resolver }),
    pluginReactQuery({
      // generated query-key aliases are unused and trip `noUnusedLocals`
      output: { path: 'hooks', mode: 'directory', banner: '// @ts-nocheck' },
      // notifications are consumed by a hand-written long-polling loop
      exclude: [{ type: 'tag', pattern: 'receiving' }],
      resolver,
    }),
    pluginFaker({ resolver }),
  ],
})
