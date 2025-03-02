
import './index.css'
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
// import Header from './components/Header'

createRoot(document.getElementById('root')).render(
<>
  <StrictMode>
     <HashRouter>
         <App />
     </HashRouter>
  </StrictMode>
</>
)
