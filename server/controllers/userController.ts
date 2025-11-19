import pkg from 'express';
const { Request, Response, NextFunction } = pkg;
import express from 'express'; // Necessário para a função serveStaticFiles
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
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
 * @route GET /api/users/latest-avatar
 * @description Retorna o caminho da última imagem carregada pelo usuário.
 * @access Private
 */
export const getLatestAvatar = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Não autorizado.' });
    }
    
    // 1. Define o diretório específico do usuário
    const userDir = path.join(UPLOADS_BASE_DIR, userId);

    try {
        const files = await fs.readdir(userDir);
        
        // Filtra apenas imagens e exclui pastas
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        ).map(file => ({
            name: file,
            path: path.join(userDir, file)
        }));

        if (imageFiles.length === 0) {
            return res.status(404).json({ message: 'Nenhuma imagem encontrada.' });
        }

        // 2. Encontra o arquivo mais recente
        let latestFile = null;
        let latestTime = 0;

        for (const file of imageFiles) {
            const stats = await fs.stat(file.path);
            if (stats.mtimeMs > latestTime) {
                latestTime = stats.mtimeMs;
                latestFile = file.path;
            }
        }
        
        // 3. Retorna o caminho relativo para o frontend usar (Ex: uploads/user-id/image.jpg)
        const relativePath = path.relative(path.resolve(process.cwd()), latestFile).replace(/\\/g, '/');

        res.status(200).json({
            latestImagePath: relativePath
        });

    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ message: 'Diretório de usuário não encontrado.' });
        }
        console.error('Erro ao buscar a última imagem:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
/**
 * @route GET /api/users/edit-profile
 * @description Busca e retorna os detalhes do perfil do usuário logado.
 * @access Private
 */
export const getProfile = async (req: Request, res: Response) => {
    // ⚠️ Assumindo que o middleware de autenticação anexa o objeto completo ou o ID em req.user
    const userId = (req.user as any)?._id || (req.user as any)?.id; 

    if (!userId) {
        return res.status(401).json({ message: 'ID do usuário não fornecido pela autenticação.' });
    }

    try {
        // Busca o usuário no DB, garantindo que o `userImagePath` mais recente seja incluído.
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // 🎯 CORREÇÃO: Retorna o objeto 'user' recém-buscado do DB
        // Isso garante que os dados, incluindo o 'userImagePath', estejam atualizados.
        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                userImagePath: user.userImagePath, // Inclui o caminho da imagem!
                // Adicione quaisquer outros campos que o frontend espera (ex: createdAt, phone)
            }
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


export const updateAvatar = async (req: Request, res: Response) => {
    // 1. Validar si hay un archivo nuevo
    if (!req.file) {
        return res.status(400).json({ message: "No se proporcionó ningún archivo de imagen." });
    }

    try {
        // Obtenemos el usuario por su ID (proporcionado por el middleware `protect`)
        const user = await User.findById(req.user.id);

        if (!user) {
            // Si el usuario no existe, eliminamos el archivo recién subido antes de salir
            await fs.unlink(req.file.path); 
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // --- Lógica CRÍTICA para eliminar el archivo antiguo ---
        const oldImagePath = user.userImagePath;

        // 2. Guardamos la nueva ruta del archivo en el modelo
        const newImagePath = req.file.path; 
        user.userImagePath = newImagePath;
        
        // 3. Guardamos los cambios en la base de datos
        await user.save();

        // 4. Si existe una imagen antigua, la eliminamos del sistema de archivos
        if (oldImagePath) {
            try {
                // Usamos fs.unlink para eliminar el archivo de forma asíncrona
                await fs.unlink(oldImagePath); 
                console.log(`[Avatar Cleanup] Imagen antigua eliminada: ${oldImagePath}`);
            } catch (err) {
                // Es importante manejar el error aquí (ej: si el archivo ya no existe), 
                // pero permitimos que la operación de guardado continúe
                console.error(`[Avatar Cleanup ERROR] No se pudo eliminar la imagen antigua ${oldImagePath}:`, err.message);
            }
        }
        // --------------------------------------------------------

        // 5. Respuesta exitosa
        res.status(200).json({ 
            message: "Avatar actualizado con éxito!", 
            userImagePath: newImagePath 
        });

    } catch (error) {
        console.error("Error al actualizar avatar:", error);
        
        // Si falló el guardado o la base de datos, eliminamos el archivo recién subido
        if (req.file) {
             try {
                await fs.unlink(req.file.path);
             } catch (e) {
                console.error("Fallo al eliminar el archivo subido tras un error:", e.message);
             }
        }

        res.status(500).json({ message: "Error interno del servidor al actualizar avatar." });
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
