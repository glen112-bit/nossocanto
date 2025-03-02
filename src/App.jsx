import React from 'react'
import Header from "./components/Header"
import NossoCantoSp from "./pages/NossoCantoSp"
import Instalations from "./pages/Instalations"
import Rules from "./pages/Rules"
import Places from "./pages/Places"
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import { HashRouter } from 'react-router-dom'


const router = createBrowserRouter([
    {
        path: "https://glen112-bit.github.io/nossocanto",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <NossoCantoSp/>
        </>
    },
    {
        path: "https://glen112-bit.github.io/nossocanto/Instalations",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Instalations/>
        </>

    },
    {
        path: "https://glen112-bit.github.io/nossocanto/rules",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Rules/>
        </>   
    },
    {
        path: "https://glen112-bit.github.io/nossocanto/places",
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
            <RouterProvider router={router}/>
    </>
  )
}

export default App
