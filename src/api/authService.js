import axios from 'axios';

// 🛑 Ajuste a URL base para o endereço da rota de AUTENTICAÇÃO do seu backend.
// Exemplo: Se o backend é http://localhost:3000 e as rotas de auth estão em /api/auth
// const API_AUTH_URL = 'http://localhost:3000/api/auth';
const API_AUTH_URL = 'http://localhost:3000/auth'; 

// 💡 Cliente Axios padrão para todas as requisições autenticadas/não-autenticadas
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Lida com a resposta da API, extraindo o JSON de erro se o status não for OK.
 * @param {object} error - O objeto de erro do Axios.
 */
const handleAxiosError = (error) => {
    // Se a resposta existir, extraímos a mensagem de erro do backend
    if (error.response && error.response.data && error.response.data.message) {
        // Lança o erro com a mensagem fornecida pelo backend (ex: "Usuário já existe")
        throw new Error(error.response.data.message);
    } 
    // Se o erro não for de resposta HTTP (ex: erro de rede/servidor offline)
    else if (error.request) {
        throw new Error('Erro de rede: O servidor não respondeu ou está offline.');
    } 
    // Outros erros
    else {
        throw new Error('Ocorreu um erro desconhecido ao processar a requisição.');
    }
};

// --- Funções de Gerenciamento de Token/Sessão ---

/**
 * Armazena o token JWT no localStorage e o configura no cabeçalho padrão do Axios.
 * @param {string} token - O token JWT.
 */
export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
    // Configura o cabeçalho para todas as requisições futuras
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
};

/**
 * Remove o token do localStorage e do cabeçalho do Axios (Logout).
 */
export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
};

/**
 * Verifica se um token existe no localStorage e o configura no Axios ao iniciar o App.
 */
export const setupAxiosDefaults = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        setAuthToken(token);
    }
};

// 💡 Chame isso uma vez no seu ponto de entrada (ex: App.jsx ou index.js)
setupAxiosDefaults();

// --- Funções da API ---

/**
 * 🔑 Envia dados para a rota de Registro (POST /auth/register).
 */
export const registerUser = async (username, email, password) => {
    try {
        // Usa `apiClient` para a requisição
        const response = await apiClient.post(`${API_AUTH_URL}/register`, {
            username,
            email,
            password,
        });
        
        return response.data; 

    } catch (error) {
        handleAxiosError(error);
    }
};

/**
 * 🔑 Envia dados para a rota de Login (POST /auth/login) e inicia a sessão.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>} O token JWT e os dados do usuário.
 */
export const loginUser = async (email, password) => {
    try {
        // 🛑 CORREÇÃO DE URL: Use o template literal ou garanta a barra (`/`)
        // const response = await apiClient.post(`${API_AUTH_URL}/login`, {
            const response = await axios.post(API_URL + 'login', { 
            email,
            password
        });
        
        const { token, user } = response.data; // Assume que o backend retorna token e user

        if (token) {
            // 🚀 AÇÃO CRUCIAL: Salva o token para iniciar a sessão
            setAuthToken(token);
        } else {
            // Se o login foi bem-sucedido, mas o backend não retornou o token
            throw new Error('Login bem-sucedido, mas o token não foi recebido. Verifique o backend.');
        }

        return response.data; 

    } catch (error) {
        // Aplica o tratamento de erro unificado
        handleAxiosError(error);
    }
};

export default apiClient;
