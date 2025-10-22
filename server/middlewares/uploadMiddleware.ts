// server/middlewares/uploadMiddleware.ts

import multer from 'multer';
import type { Multer } from 'multer'; // Importa apenas o tipo Multer
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuração de Caminho para ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 1 Megabyte (MB) = 1024 * 1024 bytes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (Exemplo de limite ajustado)
// --- 1. Configuração de Storage ---
const storage = multer.diskStorage({
    // Define o destino do arquivo (a pasta onde será salvo)
    destination: (req, file, cb) => {
        // Salva os arquivos na pasta 'uploads' na raiz do seu servidor
        const uploadPath = path.join(__dirname, '..', '..', 'uploads');
        cb(null, uploadPath);
    },

    // Define o nome do arquivo
    filename: (req, file, cb) => {
        // Cria um nome único: 'timestamp-nomeoriginal.extensao'
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// --- 2. Filtro de Arquivos (Opcional, mas recomendado) ---
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Aceita apenas imagens (JPEG, PNG, GIF)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
};

// --- 3. Cria o objeto Multer configurado ---
// Usamos o 'type' Multer para evitar erros de sintaxe durante a execução.
export const upload: Multer = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        // fileSize: 5 * 1024 * 1024, // Limite de 5MB por arquivo
        // fileSize: MAX_FILE_SIZE,
        fileSize: 100000000,
    }
});
