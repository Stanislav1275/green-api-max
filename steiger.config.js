import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // a feature used by a single page is still a feature: it owns its own model and tests
    rules: { 'fsd/insignificant-slice': 'off' },
  },
  {
    ignores: ['./src/shared/api/gen/**'],
  },
])
