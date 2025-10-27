// server/middlewares/uploadMiddleware.ts
import multer from 'multer';
import type { Multer } from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';
// 💡 CORREÇÃO/SIMPLIFICAÇÃO: Importe o Request e Response diretamente
import express from 'express';
import type { Request, Response } from 'express'; 

// --- Tipagem para a Requisição do Express (CustomRequest) ---
// Extende a interface Request (importada do 'express') para incluir propriedades personalizadas
interface CustomRequest extends Request {
    // Tipagem segura para req.user (que será populado por middlewares)
    user?: { _id?: string | number; id?: string | number; [key: string]: any }; 
    uploadedFilename?: string; 
    // Express.Multer.File é o tipo correto para o arquivo adicionado pelo Multer
    file?: Express.Multer.File; 
}

// --- Configuração de Caminho para ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPLOADS_ROOT_DIR aponta para o diretório raiz 'uploads'
const UPLOADS_ROOT_DIR = path.resolve(__dirname, '..', '..', 'uploads');
const TEMP_FOLDER_NAME = 'temp_register'; 
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// --- 1. Configuração de Storage ---
const storage = multer.diskStorage({
    destination: (req: CustomRequest, file, cb) => {
        const userId = req.user?._id || req.user?.id;
        
        // Usa req.originalUrl para capturar a rota, garantindo que o registro funcione
        const isRegistrationRoute = req.originalUrl.includes('/register');

        let targetDir: string;

        if (isRegistrationRoute && !userId) {
            // Rota de registro: Salva em 'temp_register'
            targetDir = path.join(UPLOADS_ROOT_DIR, TEMP_FOLDER_NAME);
        } else if (userId) {
            // Rota autenticada: Salva em uploads/USER_ID/
            targetDir = path.join(UPLOADS_ROOT_DIR, userId.toString());
        } else {
            // Fallback para rotas autenticadas não-identificadas
            return cb(new Error("User ID is required for file destination and upload."), false);
        }

        // 2. Cria o diretório se não existir
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        cb(null, targetDir);
    },

    // Define o nome do arquivo
    filename: (req: CustomRequest, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const generatedFilename = `${file.fieldname}-${uniqueSuffix}${extension}`;
        
        // Armazena na requisição (opcional, mas útil para debug/controller)
        req.uploadedFilename = generatedFilename; 

        cb(null, generatedFilename); // Usa o nome de arquivo gerado para salvar no disco
    }
});

// --- 2. Filtro de Arquivos ---
// Usa CustomRequest na tipagem
const fileFilter = (req: CustomRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
};

// --- 3. Cria o objeto Multer configurado ---
export const upload: Multer = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    }
});
