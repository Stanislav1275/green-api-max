import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// the compiler only memoizes; under Vitest its cache branches would pollute coverage
const reactCompiler = process.env.VITEST ? [] : [babel({ presets: [reactCompilerPreset()] })]

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react(), ...reactCompiler, tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
})
