import React from 'react'
import Header from "./components/Header"
import NossoCantoSp from "./pages/NossoCantoSp"
import Instalations from "./pages/Instalations"
import Rules from "./pages/Rules"
import Places from "./pages/Places"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { HashRouter } from 'react-router-dom'


const router = createBrowserRouter([
    
    {
       element: <Header text="NossoCantoSp"/>
    },
    {
        path: "/",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <NossoCantoSp/>
        </>
    },
    {
        path: "instalations",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Instalations/>
        </>

    },
    {
        path: "/rules",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Rules/>
        </>   
    },
    {
        path: "/places",
        element: 
        <>
            <Header text="NossoCantoSp"/>
            <Places/>
        </> 
    }
])



function App() {

  return (
    <>
        <HashRouter>
            <RouterProvider router={router}/>
        </HashRouter>
    </>
  )
}

export default App
