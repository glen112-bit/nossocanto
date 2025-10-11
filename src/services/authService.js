import axios from 'axios';

// 🛑 Ajuste a URL base para o endereço do seu backend (o que você usou em server.ts)
const API_URL = 'http://localhost:3000/auth'; 

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

/**
 * 🔑 Envia dados para a rota de Registro (POST /auth/register).
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Os dados do novo usuário criado.
 */
export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            email,
            password,
        });
        
        // Retorna apenas os dados do usuário (o token será obtido no login, se for o fluxo)
        return response.data; 

    } catch (error) {
        handleAxiosError(error);
    }
};

/**
 * 🔑 Envia dados para a rota de Login (POST /auth/login).
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>} O token JWT e os dados do usuário.
 */
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(API_URL + 'login', {
            email,
            password
        });
        
        // 🛑 MUITO IMPORTANTE: O backend DEVE retornar o token e os dados do usuário.
        // Assumimos que o backend retorna { token: '...', user: {...} }
        return response.data; 

    } catch (error) {
        // Trata erros de resposta do servidor (ex: 401 Credenciais inválidas)
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Erro de conexão ou servidor. Tente novamente.');
    }
};
