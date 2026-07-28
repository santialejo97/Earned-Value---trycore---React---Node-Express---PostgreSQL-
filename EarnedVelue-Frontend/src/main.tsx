import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { EarnedApp } from './EarnedApp'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EarnedApp />
  </StrictMode>,
)
