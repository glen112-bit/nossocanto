// server/utils/generateToken.ts (Solução de Último Recurso)
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// 🛑 Solução de fallback: Carrega dotenv aqui também
dotenv.config();

export const generateToken = (id: string): string => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('Chave secreta de JWT ausente.');
    }

    return jwt.sign({ id }, secret!, {
        expiresIn: '30d',
    });
};
