// O seu arquivo de contexto (AuthContext.jsx ou similar)

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// Importe o seu valor de API_URL do .env (ou use o valor fixo)
const API_URL = "http://localhost:3000/api/auth"; // Verifique sua rota real!

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 1. Inicializa o estado lendo do Local Storage
    // Usamos 'userToken' para ser consistente com o seu LoginPage.jsx
    const [token, setToken] = useState(localStorage.getItem('userToken') || null); 
    
    // Inicializa o user usando uma função para ler o localStorage apenas uma vez
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // 🛑 isAuthenticated deve ser uma variável DERIVADA, não um estado.
    // Isso garante que ele SEMPRE reflita o valor atual de 'token'.
    const isAuthenticated = !!token; // TRUE se token for uma string, FALSE se for null/vazio.

    // 2. Efeito para Sincronização e Logout
    // Este efeito garante que, se o token for limpo, o usuário também seja
    useEffect(() => {
        if (!token) {
            setUser(null);
            localStorage.removeItem('user');
        }
    }, [token]);


    // 🛑 Função de LOGIN 🛑
    const login = async (email, password, navigate) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            
            // Supondo que o backend retorna { token: '...', user: { username: '...' } }
            const { token: receivedToken, user: userData } = response.data;

            // 1. ARMAZENAMENTO (Chave para a persistência)
            localStorage.setItem('userToken', receivedToken); // Atualiza token no LocalStorage
            localStorage.setItem('user', JSON.stringify(userData)); // Salva dados do usuário
            
            // 2. ATUALIZAÇÃO DO ESTADO (Dispara a re-renderização e atualiza isAuthenticated)
            setToken(receivedToken);
            setUser(userData);

            // 3. REDIRECIONAMENTO (usando window.location.hash para compatibilidade com seu LoginPage)
            if (navigate) {
                // Se você estiver usando 'navigate' (do react-router-dom)
                navigate('/nossocantosp'); 
            } else {
                // Caso contrário, usamos a navegação via hash, como em seu LoginPage.jsx
                window.location.hash = '/nossocantosp';
            }

        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            throw new Error(error.response?.data?.message || 'Erro ao tentar fazer login.');
        }
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setToken(null); // Isso dispara o useEffect e limpa o usuário
        window.location.hash = '/login'; // Redireciona para o login
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Lembre-se de envolver o seu App com <AuthProvider>
