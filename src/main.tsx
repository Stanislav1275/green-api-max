import './app/styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/app'
import { initDemoMode } from './shared/lib/demo-mode'

const root = document.getElementById('root')

if (root) {
  await initDemoMode()
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
