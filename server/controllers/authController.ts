import passport from 'passport' // O Passport é importado, mas as estratégias não são configuradas aqui
import express from 'express';
import type { Request, Response } from 'express'; 

import User from '../models/User.ts'; // Alterado para .js para consistência ESM
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// A lógica de configuração do Passport (estrategias, serialize/deserialize)
// foi removida daqui. A configuração do Google já está correta em server.ts.

/**
 * Gera um JSON Web Token (JWT) para o ID de usuário fornecido.
 * @param id O ID do usuário (string).
 * @returns O token JWT assinado.
 * @throws {Error} Se JWT_SECRET não estiver configurado.
 */
const generateToken = (id: string): string => {
      if(!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be configured');
        }
        return jwt.sign({ id }, process.env.JWT_SECRET as string,  {
              expiresIn: '30d',
          });
};
interface AuthenticatedRequest extends Request {
    user?: any;
}

export const getMe = (req: AuthenticatedRequest, res: Response) => {
    // O objeto user já está disponível graças ao Passport e ao middleware 'protect'
    const user = req.user;

    // Retorna apenas os dados necessários para o frontend
    res.json({
        id: user._id,
        name: user.name, // Nome do usuário
        email: user.email,
        profileImageUrl: user.profileImageUrl, // Caminho/URL da foto
    });
};
/**
 * Lida com o registro de novos usuários com credenciais de email/senha.
 */
const saltRounds = 10;

export const registerUser = async(req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const avatarPath = req.file ? (req.file as Express.Multer.File).path : null;
 console.log("Dados recebidos para registro:", req.body); 
  if(!username || !email || !password) {
    // ... (código para deletar avatar e erro 400)
    if (avatarPath) {
      await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar", err))
      // const fs = await import('fs/promises');
      // await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar", err));
    }
    return res.status(400).json({message: 'Todos os campos são obrigatórios (username, email, password).'});
  }

  try {
    // Verifica se o usuário já existe pelo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if( avatarPath ) {
        await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar por duplicidade", err)) 
      }
      return res.status(409).json({ message: 'Este email já está em uso.' });
    }

    // 1. GERA O HASH
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. CRIA O NOVO USUÁRIO USANDO O HASH
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, // <-- CORREÇÃO: Usar o HASH
      avatarUrl: avatarPath, 
    });

    await newUser.save();

    // ... (código para retorno 201)
    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: {
        id: newUser._id, // Usar _id do Mongoose
        username: newUser.username,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
      },
    });       
     }catch(error: any) {
        // 11000 é o código para duplicidade no MongoDB (email ou username único)
      if (avatarPath) {
        // const fs = await import('fs/promises');
        await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar após erro", err));
      }
       if(error.code === 11000) {
        return res.status(409).json({message: 'Email ou nome de usuário já está em uso.'});
      }
      console.error("Erro no registro:", error);
      return res.status(500).json({message:'Erro ao registrar usuário.', error: error.message })
    }
};

/**
 * Lida com o login de usuários com credenciais de email/senha.
 */
export const loginUser = async (req: Request, res: Response ) => {
      const {email, password} = req.body;

      try {
      const user = await User.findOne({ email });

       if(!user) {
      return res.status(401).json({message: 'Credenciais inválidas: Email ou senha incorretos.'});
  }           
       const passwordMatches = user.password && (await bcrypt.compare(password, user.password));     // Verifica se o usuário existe e se a senha corresponde
           if (user && passwordMatches){
            const token = generateToken(user._id.toString());

            return res.status(200).json({
                message: 'Login bem-sucedido!', 
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    token: token, // Inclui o token para o frontend
                }
            });
            // 🛑 REMOVER: O redirecionamento aqui não funciona em uma API REST.
            // res.redirect('/')
                  }else {
                        return res.status(401).json({message: 'Credenciais inválidas: Email ou senha incorretos.'});
                    }
                } catch (error: any) {
                      console.error('Error no Login:', error);

                      return res.status(500).json({message: 'Erro no servidor durante o login.', error: error.message });
                  }
}
