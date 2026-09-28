import { defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/shared/lib/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/shared/api/gen/**',
          'src/**/*.test.{ts,tsx}',
          'src/**/*.d.ts',
          'src/shared/lib/test/**',
          'src/app/stories/render-app.tsx',
          // entry point: covered by E2E, not by jsdom
          'src/main.tsx',
          // type-only modules
          'src/**/model/types.ts',
          'src/shared/api/errors/app-error.ts',
        ],
        reporter: ['text-summary', 'text', 'html', 'lcov'],
        thresholds: { 100: true },
      },
    },
  }),
)
