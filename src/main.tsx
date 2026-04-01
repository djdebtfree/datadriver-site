import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import Home from './components/Home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-center" richColors />
    <Home />
  </StrictMode>,
)
