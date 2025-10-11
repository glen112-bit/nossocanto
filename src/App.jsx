import React from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import Header from "./components/Header"
import Feed from "./components/Feed"
import Profile from './components/Profile';
import NossoCantoSp from "./pages/NossoCantoSp"
import UploadPage from './pages/UploadPage';
import Instalations from "./pages/Instalations"
import Rules from "./pages/Rules"
import Places from "./pages/Places"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MediaDetails from './components/MediaDetails';
import { RouterProvider, createBrowserRouter, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'; 

//Animation variants
const pageVariants = {
    initial: {
        opacity: 0,
        x: "-100vw"
    },
    in: {
        opacity: 1,
        x: 0
    },
    out: {
        opacity: 0,
        x: "100vw"
    }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
}


const RootLayout = () => {
    const location = useLocation();

    return (
        <>
            <Header Text="NossoCantoSp" />
            <AnimatePresence mode="wait">
                <motion.main
                    key={location.pathname}
                    initial="initial"
                    animate= "in"
                    exit="out"
                    variants={pageVariants}
                    transition={pageTransition}
                >
                    <Outlet />
                </motion.main>
            </AnimatePresence >
        </>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <NossoCantoSp />
            },
            {
                path: "instalations",
                element: <Instalations />
            },
            { 
                path: "rules",
                element: <Rules />
            },
            {
                path: "places",
                element: <Places />
            },
            {
                path:"login",
                element: <Login />
            },
            {
                path: "register", // 🛑 Adicione a rota de Registro
                element: <Register />
            },
            {
                path: "feed", // 🛑 ADICIONE ESTA ROTA PARA O FEED
                element: <Feed />
            },
            {
                path: "profile", // 🛑 ADICIONE ESTA ROTA
                element: <Profile />
            },
            { 
                path: "upload", 
                element: <UploadPage /> 
            },
            {
                path: "media/:mediaId", // 🛑 ADICIONE ESTA ROTA
                element: <MediaDetails />
            },
        ]
    },
]);
function App(){
    return(
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    )
}

export default App
