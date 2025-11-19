import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Importe o seu valor de API_URL do .env (ou use o valor fixo)
const API_URL = "http://localhost:3000/api/auth";

// Inicialização do AuthContext
export const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    // 💡 IMPORTANTE: Adicionado o tipo da função aqui
    updateUserAvatarPath: () => {} 
});

export const AuthProvider = ({ children }) => {
    // ... (Estados e Variáveis Derivadas permanecem iguais)
    const [token, setToken] = useState(localStorage.getItem('userToken') || null);
    const [user, setUser] = useState(() => {
        // ... (Lógica de inicialização do usuário)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (error) {
                console.error("ERRO ao fazer JSON.parse do usuário no LocalStorage:", error);
                return null;
            }
        }
        return null;
    });

    const isAuthenticated = !!token;

    // Função de Logout - OK
    const logout = useCallback(() => {
        // ... (Lógica de logout permanece igual)
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        window.location.hash = '/login';
    }, []);


    // 🚀 NOVO: Função para ATUALIZAR O CAMINHO DA IMAGEM NO ESTADO E LOCALSTORAGE
    // Deve ser um useCallback para estabilidade, mas uma função normal funciona.
    const updateUserAvatarPath = useCallback((newPath) => {
        setUser(currentUser => {
            if (!currentUser) return null;

            // 1. Cria o novo objeto de usuário
            const updatedUser = {
                ...currentUser,
                // O campo CRÍTICO que o ProfilePage lê
                userImagePath: newPath 
            };
            
            // 2. Salva o usuário ATUALIZADO no LocalStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // 3. Retorna o novo estado
            return updatedUser;
        });
        console.log("AuthContext: Caminho do avatar atualizado para:", newPath);
    }, []); // Dependências vazias = função estável


    // Efeito 1: Configuração do Axios e Limpeza de Token - OK
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
            if (user) setUser(null);
        }
    }, [token, user]);


    // Efeito 2: Re-Hidratação (Verifica se o usuário precisa ser buscado) - OK
    useEffect(() => {
        // ... (Lógica de re-hidratação permanece igual)
        const fetchUserData = async () => {
            if (!token || user) return;
            // ... (restante da lógica fetchUserData)
        };
        fetchUserData();
    }, [token, user, logout]);


    // Função de LOGIN - OK
    const login = async (email, password, navigate) => {
        try {
            // ... (Lógica de Login permanece igual)
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token: receivedToken, user: userData } = response.data;
            
            localStorage.setItem('userToken', receivedToken);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setToken(receivedToken);
            setUser(userData);

            if (navigate) {
                navigate('/');
            } else {
                window.location.hash = '/';
            }
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            setToken(null);
            throw new Error(error.response?.data?.message || 'Erro ao tentar fazer login.');
        }
    };

    // 💡 ALTERAÇÃO CRÍTICA: Expor a nova função no provider
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUserAvatarPath }}>
            {children}
        </AuthContext.Provider>
    );
};

// Lembre-se de envolver o seu App com <AuthProvider>
