import express from 'express';
import type { Router, Request, Response  } from 'express';
import Comment from '../models/Comment.ts';
import Media from '../models/Media.ts';
// import { protect, AuthRequest } from '../middlewares/authMiddleware.ts'; // Importa o middleware de autenticação e o tipo Request estendido
import { protect  } from '../middlewares/authMiddleware.ts'; // ✅ Importação de VALOR (o middleware)
import type { AuthRequest  } from '../middlewares/authMiddleware.ts'; // ✅ Importação de TIPO (a interface)

import mongoose, { Types } from 'mongoose';

const router: Router = express.Router();

// ===============================================
// ROTA 1: CRIAR NOVO COMENTÁRIO (POST /comment/:mediaId)
// Protegida por 'protect' - apenas usuários logados podem comentar.
// ===============================================
router.post('/:mediaId', protect, async (req: AuthRequest, res: Response) => {
    const { mediaId } = req.params;
    const { text } = req.body;
    
    // O ID do usuário logado é anexado pelo middleware 'protect'
    const ownerId = req.user?._id; 
    
    // 1. Validação simples
    if (!text || text.trim() === '') {
        return res.status(400).json({ message: 'O texto do comentário não pode ser vazio.' });
    }
    
    // 2. Verifica se a Media existe
    if (!mongoose.Types.ObjectId.isValid(mediaId)) {
        return res.status(404).json({ message: 'ID da mídia inválido.' });
    }

    try {
        const media = await Media.findById(mediaId);
        
        if (!media) {
            return res.status(404).json({ message: 'Mídia não encontrada.' });
        }

        // 3. Cria o novo Comentário
        const newComment = new Comment({
            text,
            media: mediaId as unknown as Types.ObjectId,
            owner: ownerId as Types.ObjectId,
        });
        
        await newComment.save();
        
        // 4. Anexa o ID do comentário à lista de comentários da Mídia
        media.comments.push(newComment._id as Types.ObjectId);
        await media.save();

        // 5. Retorna o novo comentário (pode popular o owner aqui se necessário)
        const comment = await newComment.populate('owner', 'username profileImageUrl'); 

        res.status(201).json(comment);
        
    } catch (error: any) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ message: 'Erro interno ao processar o comentário.', details: error.message });
    }
});

// ===============================================
// ROTA 2: BUSCAR COMENTÁRIOS DE UMA MÍDIA (GET /comment/:mediaId)
// Rota pública - qualquer um pode ver os comentários.
// ===============================================
router.get('/:mediaId', async (req: Request, res: Response) => {
    const { mediaId } = req.params;
    
    // 1. Validação de ID
    if (!mongoose.Types.ObjectId.isValid(mediaId)) {
        return res.status(400).json({ message: 'ID da mídia inválido.' });
    }

    try {
        // 2. Busca todos os comentários para o mediaId fornecido
        // Popula o campo 'owner' para incluir o username e profileImageUrl (útil para o frontend)
        const comments = await Comment.find({ media: mediaId })
            .sort({ createdAt: 1 }) // Ordena do mais antigo para o mais recente
            .populate('owner', 'username profileImageUrl'); // Exclui a senha

        if (!comments.length) {
            return res.status(200).json([]); // Retorna array vazio se não houver comentários
        }

        res.json(comments);

    } catch (error: any) {
        console.error('Erro ao buscar comentários:', error);
        res.status(500).json({ message: 'Erro ao buscar comentários.', details: error.message });
    }
});

export default router;
