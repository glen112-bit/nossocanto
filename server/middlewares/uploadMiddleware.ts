import multer from 'multer';
import type { Multer } from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// --- Configuração de Caminho para ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPLOADS_ROOT_DIR aponta para /nossocanto/uploads
// Deve subir dois níveis a partir de /server/middlewares/
const UPLOADS_ROOT_DIR = path.join(__dirname, '..', '..', 'uploads');

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB (Aumentado de 5MB para resolver o erro "File too large")

// --- 1. Configuração de Storage ---
const storage = multer.diskStorage({
    // Define o destino do arquivo (a pasta onde será salvo)
    destination: (req, file, cb) => {
        
        // 🚨 CRÍTICO: Verifica se o ID do usuário existe como '_id' (Mongoose) ou 'id'
        const userId = (req.user as any)?._id || (req.user as any)?.id; 
        
        // 💡 LÓGICA DE ROTA PÚBLICA (REGISTRO):
        // Verifica se a rota atual é de registro E se o usuário não está autenticado.
        const isRegistrationRoute = req.originalUrl.includes('/register');

        let targetDir: string;

        if (isRegistrationRoute && !userId) {
            // Rota pública de registro: Salva em 'temp'. 
            // O controller DEVE MOVER este arquivo após a criação do usuário.
            targetDir = path.join(UPLOADS_ROOT_DIR, 'temp');
        } else if (userId) {
            // Rota autenticada: Salva em uploads/USER_ID/
            targetDir = path.join(UPLOADS_ROOT_DIR, userId.toString());
        } else {
            // Rota que deveria ser autenticada (ex: update-avatar), mas o ID está faltando.
            // Isso aciona o erro original de runtime, que é o que queremos evitar se a rota for patch/delete.
            return cb(new Error("User ID is required for file destination."), false);
        }

        // 2. Cria o diretório se não existir
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // 3. Define o destino
        cb(null, targetDir);
    },

    // Define o nome do arquivo
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        
        // Armazena o nome do arquivo na requisição para que o controller possa usá-lo
        (req as any).uploadedFilename = `${file.fieldname}-${uniqueSuffix}${extension}`;

        cb(null, (req as any).uploadedFilename);
    }
});

// --- 2. Filtro de Arquivos (Opcional, mas recomendado) ---
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // Retorna um erro que o Multer pode processar
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
