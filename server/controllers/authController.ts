
import express from 'express'; // Import the Express factory function and its main type
import type { Request, Response } from 'express'; // ⬅️ IMPORT TYPES ONLY
import User from '../models/User.ts'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = (user: { _id: IUser['_id']  }): string => {
    if (!JWT_SECRET) {
        console.error("ERRO FATAL: JWT_SECRET não está definido. Verifique seu arquivo .env");
        throw new Error("JWT_SECRET must be configured.");
    }
    return jwt.sign(
        { id: user._id }, 
        JWT_SECRET, 
        { expiresIn: '1d' } // Expira em 1 dia
    );
};

/**
 * 🚀 Função para registrar um novo usuário
 */
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // 1. Validação básica (o 'return' já estava correto aqui)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // 2. Checagem explícita se o usuário existe (Mais claro que depender apenas do error.code === 11000)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Este email já está registrado.' });
        }

        // 3. Cria a nova instância do usuário.
        const newUser = new User({
            username,
            email,
            password 
        });

        // 4. Salva no MongoDB (o hook 'pre save' criptografa a senha aqui)
        await newUser.save(); 

        // 5. Gera o token JWT para login automático no frontend
        const token = generateToken(newUser);

        // 6. Responde APENAS UMA VEZ com sucesso (corrigido)
        return res.status(201).json({
            token, // Retorna o token, conforme o frontend espera
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.error("Erro no registro:", error);

        // 7. Trata erro de duplicidade (caso o username também seja unique, por exemplo)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email ou nome de usuário já está em uso.' });
        }

        // 8. Resposta de erro final (Adicionado 'return' para garantir o encerramento)
        return res.status(500).json({ message: 'Erro interno ao registrar usuário.', error: error.message });
    }
};

/**
 * 🔑 Função para login de usuário
 */
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        // 1. Encontra o usuário pelo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha fornecida com o hash armazenado
        // NOTE: Assume que a função compare está disponível no bcrypt que você importou.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Gera o JWT
        const token = generateToken(user);

        // 4. Responde com o token e os dados do usuário (Adicionado 'return' para encerramento)
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        // 🛑 CORREÇÃO: Adicionado 'return' para garantir que a função encerre após enviar a resposta de erro
        return res.status(500).json({ message: 'Erro interno do servidor ao logar.', error: error.message });
    }
};
// export default controller;
