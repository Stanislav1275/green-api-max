import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const reactCompiler = process.env.VITEST ? [] : [babel({ presets: [reactCompilerPreset()] })]

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://*.green-api.com https://*.greenapi.com",
  "worker-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const contentSecurityPolicy = (): Plugin => ({
  name: 'content-security-policy',
  apply: 'build',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
      injectTo: 'head-prepend',
    },
  ],
})

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react(), ...reactCompiler, tailwindcss(), contentSecurityPolicy()],
  resolve: {
    tsconfigPaths: true,
  },
})
