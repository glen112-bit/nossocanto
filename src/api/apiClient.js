// src/api/apiClient.js
import axios from 'axios';

// Obtém a URL base da API das variáveis de ambiente do Vite
// Lembre-se que as variáveis do Vite começam com VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
