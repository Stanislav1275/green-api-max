import './app/styles/index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/app'
import { enableMocking } from './app/mocks/enable-mocking'

const root = document.getElementById('root')

if (root) {
  await enableMocking()
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
