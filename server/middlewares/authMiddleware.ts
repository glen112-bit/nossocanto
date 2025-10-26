import jwt from 'jsonwebtoken';
import express from 'express';
import type { Request, Response } from 'express'; 
// Ajuste a importação para o seu modelo correto
import User from '../models/User.ts'; 

// --- Configuração de Tipagem (Necessária para TypeScript) ---

// Define o tipo de dado que esperamos no req.user
interface UserPayload {
    _id: string; // Ou 'id', dependendo do que você coloca no JWT
}

// Estende a interface Request do Express
interface AuthRequest extends Request {
    user?: UserPayload | null; // Garante que 'user' terá um ID válido ou será null
}

// --- Middleware de Proteção ---

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Verifica se o token está no cabeçalho 'Authorization'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtém o token do header
            token = req.headers.authorization.split(' ')[1];

            // 2. Decodifica o token (verifica validade e expiração)
            // Use '!' apenas se você tiver certeza que JWT_SECRET foi carregado.
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id?: string, _id?: string };

            // Pega o ID do payload (ajuste para 'id' ou '_id' conforme seu JWT)
            const userId = decoded.id || decoded._id;
            
            if (!userId) {
                 // Deve ocorrer se o payload não tiver ID. Token válido, mas malformado.
                return res.status(401).json({ message: 'Token malformado: ID do usuário ausente.' });
            }

            // 3. Busca o usuário no DB
            const user = await User.findById(userId).select('-password');

            // 4. Se o usuário for encontrado (autenticação de sucesso)
            if (user) {
                // Anexa o objeto do usuário (ou o que precisar dele)
                req.user = user; 
                return next(); // Chama o próximo middleware/controller
            } else {
                // Usuário não encontrado (ID válido, mas usuário foi deletado)
                return res.status(401).json({ message: 'Não autorizado, usuário não existe mais.' });
            }

        } catch (error) {
            // Este catch pega erros de jwt.verify (Token Inválido, Expirado, Secret errado)
            console.error('Erro de Autenticação/JWT:', error);
            // 🛑 CRÍTICO: Se a verificação falhar, retorna 401 e encerra
            return res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' });
        }
    }

    // 🛑 CRÍTICO: Se o código chegar aqui e não houver token, retorna 401 e encerra
    if (!token) {
        return res.status(401).json({ message: 'Não autorizado, token Bearer não encontrado.' });
    }
};

// ... Mantenha o uploadMiddleware ...
export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // ...
    next();
};

export default protect;
// Certifique-se de exportar e usar este middleware nas suas rotas protegidas.
