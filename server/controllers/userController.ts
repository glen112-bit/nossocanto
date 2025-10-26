import pkg from 'express';
const { Request, Response, NextFunction } = pkg;
import express from 'express'; // Necessário para a função serveStaticFiles
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
// ⚠️ Nota: Substitua 'User' pela importação do seu modelo Mongoose real.
import User from '../models/User.ts'; 

// O diretório base onde os arquivos de upload são armazenados.
// Certifique-se de que isso corresponda ao caminho no seu middleware 'upload'.
const UPLOADS_BASE_DIR = path.resolve(process.cwd(), 'uploads'); 

// Assumindo que seu modelo Mongoose anexa 'userImagePath'
interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password?: string; // Incluído para bcrypt.compare
    userImagePath?: string; // Caminho da imagem salvo no DB
    [key: string]: any;
}

// Estende o Request para incluir o campo anexado pelo middleware de autenticação
interface AuthRequest extends Request {
    userId?: string; // Se o middleware anexar o ID aqui
    user?: { id: string }; // Se o middleware anexar em req.user (mais comum em Mongoose/JWT)
    body: any; // O corpo pode ter texto e senhas
    file?: Express.Multer.File; // Para o upload de avatar
}

/**
 * @route GET /api/users/edit-profile
 * @description Busca e retorna os detalhes do perfil do usuário logado.
 * @access Private
 */
export const getProfile = async (req: Request, res: Response) => {
    const userId = (req.user as any)?._id;

    // const userId = req.userId || req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'ID do usuário não fornecido pela autenticação.' });
    }

    try {
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({
            user: req.user
        });

    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/**
 * @route PATCH /api/users/
 * @description Atualiza detalhes do perfil (username, email, senha) com verificação de senha atual.
 * @access Private
 */
export const updateUserDetails = async (req: AuthRequest, res: Response) => {
    const userId = req.userId || req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }

    const { username, email, currentPassword, newPassword } = req.body;

    if (!username && !email && !currentPassword && !newPassword) {
        return res.status(400).json({ message: 'Nenhum campo de atualização fornecido.' });
    }

    try {
        const user = await User.findById(userId) as IUser;

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // A. Verificação de Senha Atual 
        if (currentPassword || newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'A senha atual é obrigatória para qualquer alteração de senha/detalhes.' });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password || ''); 

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'A senha atual está incorreta.' });
            }
        }
        
        // B. Atualização de Campos de Texto
        if (username) user.username = username;
        if (email) user.email = email;

        // C. Atualização da Senha
        if (newPassword) {
            if (newPassword.length < 6) { 
                return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });
            }
            user.password = await bcrypt.hash(newPassword, 10); 
        }

        await user.save();

        return res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            user: {
                username: user.username,
                email: user.email,
                avatarUrl: user.userImagePath, 
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/**
 * @route PATCH /api/users/update-avatar
 * @description Lida com o upload, atualização do avatar e limpeza do arquivo antigo.
 * @access Private
 */
export const updateAvatar = async (req: AuthRequest, res: Response) => {
    const userId = req.userId || req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo de imagem enviado.' });
    }

    try {
        const user = await User.findById(userId) as IUser;
        if (!user) {
            fs.unlinkSync(req.file.path); 
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // ** A. Limpeza: Excluir a imagem antiga, se existir **
        if (user.userImagePath) {
            const oldPath = path.join(UPLOADS_BASE_DIR, user.userImagePath);
            
            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {
                    if (err) console.error('Falha ao excluir o arquivo antigo:', err);
                });
            }
        }

        // ** B. Atualizar o caminho no banco de dados **
        const relativePath = path.join(path.basename(UPLOADS_BASE_DIR), req.file.filename);
        user.userImagePath = relativePath;
        
        await user.save();

        return res.status(200).json({
            message: 'Avatar atualizado com sucesso!',
            avatarUrl: relativePath, 
        });

    } catch (error) {
        console.error('Erro ao atualizar avatar:', error);
        
        if (req.file) fs.unlinkSync(req.file.path);

        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/**
 * Middleware de Express para servir arquivos estáticos de uploads.
 * Esta função deve ser usada no seu arquivo de inicialização do servidor (app.ts/server.ts).
 */
export const serveStaticFiles = (app: express.Express) => {
    // A rota '/uploads' no navegador irá mapear para o diretório 'uploads' no servidor.
    app.use('/uploads', express.static(UPLOADS_BASE_DIR));
    console.log(`[Express] Servindo arquivos estáticos do diretório: ${UPLOADS_BASE_DIR}`);
};
