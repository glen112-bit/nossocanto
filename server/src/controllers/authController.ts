// server/controllers/authController.ts

import User from '../models/User.ts'; 
// NÃO precisa do 'jwt' se você não vai gerar o token no registro

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        // 1. Cria a instância do usuário.
        const newUser = new User({ username, email, password });

        // 2. Salva no MongoDB.
        await newUser.save(); 

        // 3. Responde com sucesso APÓS o salvamento (e sem o token).
        return res.status(201).json({ // Use 'return' para evitar execução posterior
            message: 'Usuário registrado com sucesso!',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        // 4. Trata erros
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email ou nome de usuário já está em uso.' });
        }
        console.error("Erro no registro:", error); // Adicione um log para o servidor
        return res.status(500).json({ message: 'Erro ao registrar usuário.', error: error.message });
    }
};
