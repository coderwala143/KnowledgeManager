import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import  from './App.jsx'
import UpdateStatus from "./App"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UpdateStatus />
  </StrictMode>,
)
