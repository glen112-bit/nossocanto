import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Instalations from "./pages/Instalations"
import Rules from "./pages/Rules"
import Places from "./pages/Places"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([

    {
        path: "/",
        element: <App />
    },
    {
        path: "/instalations",
        element: <Instalations/>
    },
    {
        path: "/rules",
        element: <Rules />
    },
    {
        path: "/places",
        element: <Places/>
    },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <RouterProvider router={router}/>
  </StrictMode>,
)
