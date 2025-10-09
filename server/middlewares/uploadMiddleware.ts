// /server/src/middlewares/uploadMiddleware.ts

import multer from 'multer';
import type { Request } from 'express';
import type { Multer, StorageEngine } from 'multer'

// --- CONFIGURAÇÃO DE ARMAZENAMENTO LOCAL ---

// 1. Define onde e como os arquivos serão armazenados
const storage: StorageEngine = multer.diskStorage({
    // Função para definir a pasta de destino
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        // A pasta 'uploads/' deve estar na raiz do seu diretório 'server'.
        // Se estiver executando de /src, o caminho relativo correto é '../uploads/'
        // Dependendo de onde você executa o 'ts-node', o './uploads' pode funcionar melhor. 
        // Vamos usar a pasta relativa à raiz do servidor:
        cb(null, 'uploads/'); 
    },
    // Função para definir o nome do arquivo
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        // Cria um nome único: Timestamp + nome original (com espaços substituídos)
        const filename = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
        cb(null, filename);
    }
});

// 2. Filtro para aceitar apenas imagens e vídeos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        // Rejeita o arquivo se não for imagem ou vídeo
        cb(new Error('Tipo de arquivo não suportado. Apenas imagens e vídeos são permitidos.'));
    }
};

// 3. Cria o objeto Multer configurado
const upload: Multer = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 50 } // Limite de 50MB
});

// Exporta o objeto 'upload' para ser usado nas rotas (upload.single, upload.array, etc.)
export default upload;
