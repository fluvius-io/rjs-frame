import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'rjs-frame/dist/style.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
