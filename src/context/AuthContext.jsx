// client/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService.js'; // Assumindo .js está correto

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => { // 1. ✅ Correção do nome da prop
    const [token, setToken] = useState(localStorage.getItem('token') || null); // 2. ✅ Reordenado
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [loading, setLoading] = useState(true);

    // Lógica para registrar (chama o serviço, mas não loga automaticamente)
    const register = async (username, email, password) => {
        try {
            const userData = await registerUser(username, email, password);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    // Lógica de login (versão mockada atualizada)
     const login = async (email, password) => {
        setLoading(true); // Should be set to true, though we don't handle it here
        try {
            // Destructures backend response: { token, user: userData }
            const { token, user: userData } = await loginUser(email, password); 

            // Armazena no estado e no localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData)); // Use userData

            setToken(token);
            setUser(userData);
            setIsAuthenticated(true);
            setLoading(false);
            
            // 🛑 CORREÇÃO APLICADA AQUI
            return userData; // Retorna 'userData', não 'uerData'

        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Ensure user is also removed
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            throw error;
        }
    };    // Lógica de logout
    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    };

    // Lógica para carregar o estado inicial (descomentado e corrigido)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Erro ao processar usuário armazenado:', error);
                logout(); // Limpa se houver erro
            }
        }
        setLoading(false); 
    }, [token]);


    const contextValue = {
        user,
        token,
        isAuthenticated,
        login, // 4. ✅ Usando a função real
        register, // 4. ✅ Usando a função real
        logout, // 4. ✅ Usando a função real
    };

    // if(loading) {
    // return <div>Cargando sesión....</div>;
    // }

    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
