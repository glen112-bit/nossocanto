import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Importe o seu valor de API_URL do .env (ou use o valor fixo)
const API_URL = "http://localhost:3000/api/auth"; 

// Inicialização do AuthContext para o TypeScript/Intellisense
export const AuthContext = createContext({
    user: null,
    isAuthenticated: false, // Reflete a autenticação baseada no token
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    
    // 1. Inicializa o estado 'token'
    const [token, setToken] = useState(localStorage.getItem('userToken') || null); 
    
    // 2. Inicializa o estado 'user' (Lê uma única vez do LocalStorage)
    const [user, setUser] = useState(() => {
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

    // Variável DERIVADA única para isAuthenticated
    const isAuthenticated = !!token; 
 
    console.log("AuthProvider RENDER: Estado 'user' atual:", user, "| Authenticated:", isAuthenticated);
    
    // Função de Logout - Criada como useCallback para evitar loops no useEffect de re-hidratação
    const logout = useCallback(() => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user');
        setToken(null); 
        setUser(null); // Limpa o estado local de user
        // Remove o header de autorização globalmente
        delete axios.defaults.headers.common['Authorization']; // CORRIGIDO: Removido o ponto extra após 'delete'
        
        window.location.hash = '/login'; 
    }, []);


    // Efeito 1: Configuração do Axios e Limpeza de Token
    useEffect(() => {
        if (token) {
            // Adiciona o token JWT ao cabeçalho de Autorização para todas as requisições futuras
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            console.log("Axios configurado com novo token JWT.");
        } else {
            // A limpeza já é feita no logout, mas garante que se o token for null, o header é removido
            delete axios.defaults.headers.common['Authorization'];
            // Este bloco também garante que o estado local 'user' seja limpo se o token sumir
            if (user) setUser(null);
            console.log("Axios Authorization header removido e usuário limpo.");
        }
    }, [token]); // Depende apenas do token


    // Efeito 2: Re-Hidratação (Verifica se o usuário precisa ser buscado) 
    useEffect(() => {
        const fetchUserData = async () => {
            // Só roda se tiver token E o estado 'user' ainda estiver vazio
            if (!token || user) return; 

            console.log("Sessão parcial detectada: Tentando re-hidratar usuário via API...");
            
            try {
                const response = await axios.get(`${API_URL}/me`); 
                const hydratedUser = response.data.user;

                if (hydratedUser) {
                    setUser(hydratedUser);
                    localStorage.setItem('user', JSON.stringify(hydratedUser));
                    console.log("Usuário re-hidratado com sucesso via API.");
                } else {
                    console.error("Token válido, mas API /me retornou dados vazios. Forçando logout.");
                    logout();
                }
            } catch (error) {
                // Token expirado ou inválido (401)
                console.error("Falha na re-hidratação (token expirado/inválido), forçando logout:", error.message);
                logout();
            }
        };

        fetchUserData();
        // Adicionamos 'logout' aqui porque é um useCallback e é estável.
    }, [token, user, logout]); 


    // Função de LOGIN 
    const login = async (email, password, navigate ) => { // Adicionamos 'navigate' como argumento opcional
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            
            const { token: receivedToken, user: userData } = response.data;

            if (!receivedToken || !userData || Object.keys(userData).length === 0) {
                 console.error("Login Error: Dados do usuário incompletos.");
                 throw new Error('Login bem-sucedido, mas dados do usuário estão incompletos. Verifique o backend.');
            }
            
            // 1. ARMAZENAMENTO
            localStorage.setItem('userToken', receivedToken); 
            localStorage.setItem('user', JSON.stringify(userData)); 
            
            // 2. ATUALIZAÇÃO DO ESTADO
            setToken(receivedToken);
            setUser(userData);      
            
            // A atualização de 'token' acima faz com que 'isAuthenticated' (!!token) seja TRUE no próximo render.

            console.log("Login BEM-SUCEDIDO. Dados de Usuário Salvos:", userData);
            
            // 3. REDIRECIONAMENTO
            if (navigate) {
                navigate('/'); 
            } else {
                // Note: Se a navegação não for injetada, use hash como fallback
                window.location.hash = '/';
            }

        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            // Limpa o token se a requisição falhar
            setToken(null);
            throw new Error(error.response?.data?.message || 'Erro ao tentar fazer login.');
        }
    }; 


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
// Lembre-se de envolver o seu App com <AuthProvider>
