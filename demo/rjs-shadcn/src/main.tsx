import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'rjs-frame/dist/style.css'
import App from './App.tsx'
import { initializeFromBrowserLocation } from 'rjs-frame'

// Initialize page state from current URL on app startup
initializeFromBrowserLocation(window.location);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
