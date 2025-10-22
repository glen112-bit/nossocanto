import passport from 'passport' // O Passport é importado, mas as estratégias não são configuradas aqui
import express from 'express';
import type { Request, Response } from 'express'; 
import * as fs from 'fs/promises';
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

export const getMe = async (req: AuthRequest, res: Response) => {
    // O ID do usuário é anexado à requisição pelo middleware 'protect'
    const userId = req.userId;

    if (!userId) {
        // Isso não deve acontecer se o middleware estiver funcionando, mas é uma segurança.
        return res.status(401).json({ message: 'Não autorizado, ID do usuário ausente.' });
    }
async function fetchProtectedData() {
    const token = localStorage.getItem('userToken');

    if (!token) {
        throw new Error("Usuário não logado");
    }

    const response = await fetch('/api/media', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <--- ENVIA O TOKEN AQUI
        },
        // Não use 'credentials: include' junto com o JWT, a menos que você também precise de cookies.
    });
    // ...
}
    try {
        // Busca o usuário pelo ID, mas exclui a senha
        const user = await User.findById(userId).select('-password');

        if (user) {
            // ✅ CORRETO: Retorna os dados do usuário no formato esperado pelo frontend
            return res.status(200).json({
                message: 'Dados do usuário recuperados com sucesso.',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    // Inclua quaisquer outros campos que você precise (ex: avatar, name)
                }
            });
        } else {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao buscar dados do usuário /me:', error);
        return res.status(500).json({ message: 'Erro no servidor ao buscar dados do usuário.' });
    }
};
/**
 * Lida com o registro de novos usuários com credenciais de email/senha.
 */
const saltRounds = 10;

export const registerUser = async(req: Request, res: Response) => {
  const { username, email, password, profileImage } = req.body;
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
      // avatarUrl: avatarPath,
      profileImage: profileImage,
    });

    await newUser.save();
    //🛑 NOVO PASSO: GERAR O TOKEN
    const token = generateToken(newUser._id.toString());
    // ... (código para retorno 201)
    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      token: token,
      user: {
        id: newUser._id, // Usar _id do Mongoose
        username: newUser.username,
        password: hashedPassword,
        email: newUser.email,
        profileImage: newUser.profileImage
        
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
export const loginUser = async (req: Request, res: Response) => {
    // const token = generateToken(user._id.toString());
    // Apenas email e password são necessários para o login
    const { email, password } = req.body; 

    // Validação básica
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        // 1. Encontra o usuário pelo email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
        }

        // 2. Compara a senha (garantindo que 'user.password' exista)
        const passwordMatches = user.password && (await bcrypt.compare(password, user.password)); 

        if (passwordMatches) {
            const token = generateToken(user._id.toString());

            // 3. RETORNA O TOKEN E OS DADOS DO USUÁRIO SEPARADAMENTE (CORREÇÃO APLICADA AQUI)
            return res.status(200).json({
                message: 'Login bem-sucedido!',
                token: token, // ✅ CORREÇÃO: Token no nível superior
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage,
                    // Inclua quaisquer outros dados que o frontend precise (avatarUrl, etc.)
                }
            });
        } else {
            // Se a senha não corresponder
            return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
        }
    } catch (error: any) {
        console.error('Error no Login:', error);
        return res.status(500).json({ message: 'Erro no servidor durante o login.', error: error.message });
    }
};
