import React from 'react'
import Header from "./components/Header"
import NossoCantoSp from "./pages/NossoCantoSp"
import Instalations from "./pages/Instalations"
import Rules from "./pages/Rules"
import Places from "./pages/Places"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserProfile from "./pages/userProfile"
import { RouterProvider, createHashRouter } from 'react-router-dom'


const router = createHashRouter([
    {
        path: "/",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <NossoCantoSp/>
        </>
    },
    {
        path: "/instalations",
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
    },
    {
        path: "/login",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Login/>
        </>
    },
    {
        path: "/register",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <Register/>
        </>
    },
    {
        path: "/profile",
        element:
        <>
            <Header text="NossoCantoSp"/>
            <UserProfile/>
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
