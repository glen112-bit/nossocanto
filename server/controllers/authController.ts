import passport from 'passport' // O Passport é importado, mas as estratégias não são configuradas aqui
import express from 'express';
import type { Request, Response } from 'express'; 
import * as fs from 'fs/promises';
import User from '../models/User.ts'; // Alterado para .js para consistência ESM
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken.ts'; // Ou onde esta função estiver
import path from 'path';
// A lógica de configuração do Passport (estrategias, serialize/deserialize)
// foi removida daqui. A configuração do Google já está correta em server.ts.

/**
 * Gera um JSON Web Token (JWT) para o ID de usuário fornecido.
 * @param id O ID do usuário (string).
 * @returns O token JWT assinado.
 * @throws {Error} Se JWT_SECRET não estiver configurado.
 */


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define o diretório raiz 'uploads' de forma consistente com o Middleware
const UPLOADS_ROOT_DIR = path.resolve(__dirname, '..', '..', 'uploads');
const TEMP_FOLDER_NAME = 'temp_register';

/**
 * Define a interface CustomRequest para incluir o campo 'user'
 * populado pelo middleware 'protect' e 'file' pelo Multer.
 */
interface CustomRequest extends Request {
  user?: any;
  file?: Express.Multer.File;
}

export const getMe = async (req: Request, res: Response) => {
    // 1. O middleware 'protect' ou 'authenticate' DEVE ter populado req.user
    // Se estiver usando TypeScript, você pode precisar estender a interface Request.
    const userObject = (req as CustomRequest).user;
    
    // 2. Verifica se o usuário autenticado existe na requisição.
    // Se o middleware de proteção funcionou, userObject deve existir.
    if (!userObject || !userObject._id) {
        // Se este erro ocorrer, significa que o Middleware falhou.
        // O cliente não deveria nem chegar aqui sem autenticação.
        console.warn('Tentativa de acesso a /me sem req.user. Verifique o Middleware de Proteção.');
        return res.status(401).json({ message: 'Não autorizado. Usuário não autenticado.' });
    }

    try {
        // Usa o ID REAL (que deve ser um ObjectId válido, como string)
        const userId = userObject._id; 
        
        // Busca o usuário no banco de dados.
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            // Se o ID for válido, mas o usuário foi deletado do DB
            return res.status(404).json({ message: 'Usuário não encontrado no banco de dados.' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('Erro ao buscar dados do usuário /me:', error);
        // O erro CastError ocorre antes do bloco catch, mas se a lógica acima for corrigida
        // ele será evitado. Mantenha o tratamento de erro genérico para outros problemas.
        res.status(500).json({ message: 'Erro interno ao buscar perfil.' });
    }
};




/**
 * Lida com o registro de novos usuários com credenciais de email/senha.
 */
const saltRounds = 10;
// const UPLOADS_BASE_DIR = path.resolve(process.cwd(), 'uploads');

export const registerUser = async(req: Request, res: Response) => {
    console.log("Iniciando registro...");
    // Deve usar CustomRequest para acessar req.file
    const { username, email, password } = req.body;
    const avatarPath = (req as CustomRequest).file ? (req as CustomRequest).file!.path : null;
    let userImagePath: string | undefined = undefined; 
    
    // 1. Validação e Limpeza de Arquivo Temporário (em caso de falha de dados)
    if(!username || !email || !password) {
        if (avatarPath) {
            // Deleta o arquivo temporário se a validação falhar
            await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar temporário (dados ausentes)", err));
        }
        return res.status(400).json({message: 'Todos os campos são obrigatórios (username, email, password).'});
    }

    try {
        // 2. Verifica se o usuário já existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if( avatarPath ) {
                // Deleta o arquivo temporário se o email já estiver em uso
                await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar temporário (duplicidade)", err)); 
            }
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }

        // 3. GERA O HASH E CRIA O NOVO USUÁRIO
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            // userImagePath é definido como null/undefined por enquanto
        });

        await newUser.save(); // Salva para obter o _id

        // --- 4. LÓGICA DE MOVER E PERSISTIR IMAGEM (CORREÇÃO) ---
        if(avatarPath) {
            const userId = newUser._id.toString();
            const filename = path.basename(avatarPath);
            
            // Define o caminho final (uploads/ID/filename)
            const destFolder = path.join(UPLOADS_ROOT_DIR, userId);
            const absolutePathFinal = path.join(destFolder, filename);

            try {
                // Cria a pasta do ID do usuário (se não existir)
                await fs.mkdir(destFolder, { recursive: true });

                // Move/Renomeia o arquivo da pasta temporária para a pasta final
                await fs.rename(avatarPath, absolutePathFinal);

                // Calcula o caminho RELATIVO para salvar no DB ('uploads/ID/filename')
                userImagePath = path.join('uploads', userId, filename).replace(/\\/g, '/');

                // Atualiza o usuário no DB com o caminho final
                newUser.userImagePath = userImagePath;
                await newUser.save();
                
                console.log(`Avatar movido para: ${absolutePathFinal}`);

            } catch (moveError) {
                console.error('Erro ao mover o avatar após o registro. O usuário foi salvo, mas sem a imagem de perfil.', moveError);
                // Se o movimento falhar, o avatarPath ainda está na temp_register.
                // Tentativa de limpeza
                await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar após erro de movimento", err));
            }
        }
        // --- FIM DA LÓGICA DE IMAGEM ---

        // 5. Geração e Retorno do Token
        const token = generateToken(newUser._id.toString());
        
        return res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            token: token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                userImagePath: newUser.userImagePath, // Retorna o caminho final ou undefined
            },
        });       
    } catch(error: any) {
        // 6. Tratamento de Erro Global (inclui erro de DB 11000)
        if (avatarPath) {
            // Tenta limpar o arquivo temporário em caso de qualquer erro no TRY
            await fs.unlink(avatarPath).catch(err => console.error("Falha ao deletar avatar após erro grave", err));
        }
        if(error.code === 11000) {
            return res.status(409).json({message: 'Email ou nome de usuário já está em uso.'});
        }
        console.error("Erro no registro:", error);
        return res.status(500).json({message:'Erro ao registrar usuário.', error: error.message })
    }
};/**
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
          userImagePath: user.userImagePath,
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
