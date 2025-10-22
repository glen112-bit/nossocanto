import jwt from 'jsonwebtoken';
import pkg from 'express';
const { Request, Response, NextFunction } = pkg;

// Estende a interface Request do Express para incluir o campo 'userId'

// Estende a interface Request do Express para incluir o campo 'userId'
interface AuthRequest extends Request {
    userId?: string;
}

/**
 * Middleware para proteger rotas. Verifica a presença e validade do token JWT.
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    
    // ✅ CORREÇÃO FINAL: Usar process.env.JWT_SECRET diretamente e garantir a tipagem string
    const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
    
    // Checagem de segurança
    if (!JWT_SECRET) {
         // Esta linha é crítica: se for undefined, o servidor está mal configurado
         console.error('ERRO CRÍTICO DE CONFIGURAÇÃO: process.env.JWT_SECRET está undefined.');
         return res.status(500).json({ message: 'Erro de configuração interna: Chave JWT não carregada.' });
    }

    let token;

    // 1. Verifica se o token está no cabeçalho (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extrai o token
            token = req.headers.authorization.split(' ')[1];

            // 2. Verifica a validade e decodifica o token
            // Usa JWT_SECRET (que agora é uma string garantida)
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

            // 3. Anexa o ID do usuário à requisição (para uso no controlador /me)
            req.userId = decoded.id;

            next();
        } catch (error) {
            console.error('Erro de Autenticação (Token Inválido):', error);
            // IMPORTANTE: Se o token falhar, a rota /me falha e o frontend desloga.
            res.status(401).json({ message: 'Não autorizado, token falhou ou expirou.' });
        }
    } else if (!token) {
        res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
    }
};

// Certifique-se de exportar e usar este middleware nas suas rotas protegidas.
// Certifique-se de exportar e usar este middleware nas suas rotas protegidas.
