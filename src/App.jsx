import React from 'react'
import Header from "./components/Header"
import NossoCantoSp from "./pages/NossoCantoSp"
import Instalations from "./pages/Instalations"
import Rules from "./pages/Rules"
import Places from "./pages/Places"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'


const router = createBrowserRouter([
    
    {
       element: <Header text="NossoCantoSp"/>
    },
    {
        path: "/nossocanto/",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <NossoCantoSp/>
        </>
    },
    {
        path: "/nossocanto/instalations",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Instalations/>
        </>

    },
    {
        path: "/nossocanto/rules",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Rules/>
        </>   
    },
    {
        path: "/nossocanto/places",
        element: 
        <>
            <Header text="NossoCantoSp"/>
            <Places/>
        </> 
    },
])



function App() {

  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default App
