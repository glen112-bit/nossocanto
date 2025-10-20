// src/hooks/useAuth.js

import React from 'react';

/**
 * Hook de autenticação simulado.
 * Em um aplicativo real, isso leria o estado de um Contexto ou Redux.
 */
export const useAuth = () => {
    // 1. Simula a obtenção do token
    const token = localStorage.getItem('token'); 
    
    // 2. Simula o objeto de usuário se o token existir
    const user = token ? {
        id: '123',
        username: 'glen_user', // Nome de usuário de exemplo
        email: 'glen@nossocanto.com',
        // Caminho de exemplo que seu servidor Express deve fornecer
        profileImagePath: 'uploads/photos/glen_user-1700000000000.png' 
    } : null;

    // 3. Retorna o estado de autenticação
    return { 
        isAuthenticated: !!token, 
        user,
        // Funções de exemplo que você pode implementar:
        // login: (token, userData) => { /* salvar no localStorage e atualizar o estado */ },
        // logout: () => { /* remover do localStorage e atualizar o estado */ },
    };
};
