import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express'; // Importa apenas os tipos do Express
import User from '../models/User.ts'; // Importa o modelo User
import type { IUser } from '../models/User.ts'; // Importa a interface do modelo User
import type { JwtPayload } from 'jsonwebtoken'; // Importa o tipo do payload do JWT

// 1. Estende a interface Request do Express para incluir o objeto 'user'.
// Isso garante a tipagem correta em rotas protegidas.
export interface AuthRequest extends Request {
    user?: IUser; // Objeto de usuário anexado após a autenticação
}

/**
 * Middleware para proteger rotas.
 * Verifica a presença e validade do token JWT no header 'Authorization'.
 */
const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 2. Verifica se o token existe no formato 'Bearer <token>'
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extrai o token da string 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];

            // 3. Verifica a validade do Token
            const secret = process.env.JWT_SECRET || 'sua_chave_secreta_padrao_muito_longa';
            
            // O jwt.verify é uma função CommonJS, usamos 'as any' para tipagem em ES Modules
            const decoded = (jwt.verify as any)(token, secret) as JwtPayload;

            // 4. Busca o usuário no DB (usando o ID decodificado)
            // Seleciona todos os campos, exceto a senha
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'Usuário não encontrado. Token inválido.' });
            }

            // 5. Anexa o objeto do usuário à requisição
            req.user = user as IUser;

            // Continua para a próxima função/rota
            next();
            
        } catch (error) {
            console.error("Erro na verificação do token:", error);
            // Retorna 401 se o token estiver expirado ou a assinatura for inválida
            return res.status(401).json({ message: 'Não autorizado, token falhou ou expirou.' });
        }
    } else {
        // 6. Caso o token esteja ausente no header
        return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
    }
};

export { protect };
