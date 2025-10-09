import express from 'express';
import { protect  } from '../middlewares/authMiddleware.ts';
import upload from '../middlewares/uploadMiddleware.ts';
import Media from '../models/Media.ts';

const router = express.Router();

// Rota para upload de mídia
router.post('/upload', upload.single('mediaFile'), async (req: AuthReques, res) => {
    const ownerId = req.user?._id;
    try {
        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }

        // 💡 1. ENVIAR PARA NUVEM (AWS S3 ou Firebase Storage)
        // Por ser um ambiente simulado, mantemos o placeholder:
        // Na produção, a URL real do arquivo seria obtida aqui.
        const fileUrl = "https://example.com/seu-arquivo-na-nuvem.jpg"; 
        
        // Determina o tipo de mídia
        const mediaType = req.file.mimetype.startsWith('image') ? 'image' : 'video';

        // 💡 2. SALVAR METADADOS NO BANCO DE DADOS
        const newMedia = new Media({
            title: req.body.title || `Novo Arquivo ${Date.now()}`,
            description: req.body.description || 'Nenhuma descrição fornecida.',
            type: mediaType,
            url: fileUrl, // Salva o link da nuvem
            owner: ownerId,
            // owner: req.user._id, // Se tiver autenticação
        });

        await newMedia.save();
        res.status(201).json(newMedia);
    } catch (error) {
        console.error("Erro no upload:", error);
        // Resposta de erro uniforme
        res.status(500).json({ message: 'Erro ao processar upload de mídia.', details: error.message });
    }
});

// Rota para buscar todas as mídias (CORRIGIDA - Endpoint alterado de '/media' para '/')
router.get('/', async (req, res) => {
    try {
        // Busca todas as mídias e as ordena pela data de criação (mais recente primeiro)
        const mediaList = await Media.find().sort({ createdAt: -1 });
        
        // Envia a resposta JSON com a lista de mídias
        res.json(mediaList);
        
    } catch(error) {
        // Se houver um erro no banco de dados, envia o status 500
        res.status(500).json({ message: 'Erro ao buscar mídias', details: error.message });
    }
});

export default router;
