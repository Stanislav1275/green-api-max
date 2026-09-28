import js from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import prettier from 'eslint-config-prettier'
import boundaries from 'eslint-plugin-boundaries'
import checkFile from 'eslint-plugin-check-file'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

// each layer may import only from layers below it
const layerPolicies = FSD_LAYERS.map((layer, index) => ({
  from: { element: { type: layer } },
  allow: {
    to: {
      element: { types: { anyOf: layer === 'shared' ? ['shared'] : FSD_LAYERS.slice(index + 1) } },
    },
  },
}))

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'src/shared/api/gen', 'public']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      eslintReact.configs['strict-type-checked'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-param-reassign': 'error',
      'prefer-const': 'error',
      'object-shorthand': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/*/*/*', '!@/shared/*/*'],
              message: 'Import slices only through their public API (index.ts).',
            },
            {
              group: ['../*/../*', '../../*'],
              message: 'Use the @/ alias for cross-slice imports.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true } },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': FSD_LAYERS.map((layer) => ({
        type: layer,
        pattern: `src/${layer}`,
      })),
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            ...layerPolicies,
            // imports inside the same layer (same slice via relative paths)
            ...FSD_LAYERS.map((layer) => ({
              from: { element: { type: layer } },
              allow: { to: { element: { type: layer } } },
            })),
          ],
        },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'check-file': checkFile },
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { 'src/**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': ['error', { 'src/**/': 'KEBAB_CASE' }],
    },
  },
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/shared/lib/test/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['*.config.{js,ts}', 'e2e/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
  prettier,
])
