import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import Home from './components/Home'
import FilterPage from './pages/FilterPage'

const path = window.location.pathname;
const AppRoot = path === '/filter' ? FilterPage : Home;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-center" richColors />
    <AppRoot />
  </StrictMode>,
)
