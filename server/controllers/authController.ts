import express from 'express'; // 1. Importa a funcionalidade principal
// 2. Importa apenas os tipos (interfaces)
import type { Express, Request, Response } from 'express'; 

import User from '../models/User.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (id: string) => {
    if(process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be configurated')
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const registerUser = async(req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({message: 'Todos os campos são obrigatórios.'})
    }

    try {
        const newUser = new User({ username, email, password });

        await newUser.save()

        return res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    }catch(error: any) {
        if(error.code === 11000) {
            return res.status(409).json({message: 'Erro ao registrar usuário.', error: error.message})
        }
        console.error("Erro no registro", error);
        return res.status(500).json({message:'Erro ao registrar usuário.', error: error.message })
    }
};

export const loginUser = async (req: Request, res: Response ) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        
        if( user && (await bcrypt.compare(password, user.password))){
            const token = generateToken(user._id.toString());

            return res.status(200).json({
                message: 'Login bem-sucedido!', 
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
        }else {
            return res.status(401).json({message: 'Credenciais invalidss'});
        }
    } catch (error) {
        console.error('Error no Login', error);

        return res.status(500).json({message: 'Erro no servidor durante o login.', error: error.message })
    }
}
