// 🛑 BLOCO DE CARREGAMENTO CRÍTICO (DEVE SER O PRIMEIRO) 🛑
import dotenv from 'dotenv';
import path from 'path'; 
import { fileURLToPath } from 'url';

// 1. Definição de Caminho
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. CONFIGURAÇÃO SÍNCRONA: Carrega o .env na raiz do projeto
dotenv.config({
    path: path.join(__dirname, '..', '.env'), 
});

// Verificação de segurança. Se isso ainda der FALSE, o arquivo .env não existe ou está vazio.
console.log(`JWT Secret Loaded: ${!!process.env.JWT_SECRET ? 'TRUE' : 'FALSE'}`); 
// ------------------------------------------------------------


// --- AGORA, E SOMENTE AGORA, fazemos as importações restantes ---
import express from 'express'; 
import type { Express, Request, Response } from 'express'; // 2. Importa apenas os tipos (interfaces)
import cors from 'cors';
import connectDB from '../config/db.js'; // 🛑 Importar la función de conexión
import mediaRouter from '../routes/mediaRoutes.ts'; // Usar .js para compatibilidade ESM
import commentRouter from '../routes/commentRoutes.ts'; // Usar .js para compatibilidade ESM
import authRouter from '../routes/authRoutes.ts'; // Usar .js para compatibilidade ESM


// --- 1. CONFIGURAÇÃO INICIAL ---
const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// --- 2. MIDDLEWARE ---
app.use(cors({
  origin: 'http://localhost:5173', // A porta que seu React está usando (pode ser 3000 ou 5173)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
})); 
app.use(express.json()); 

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. INICIO DE LA APLICACIÓN ---
// Usamos una función asíncrona para manejar la conexión antes de iniciar Express
const startServer = async () => {
    try {
        // 🛑 Llama a la función de conexión a la base de datos
        await connectDB(); 

        // --- 4. RUTAS PRINCIPALES ---
        app.get('/', (req: Request, res: Response) => {
            res.send('Backend Server está funcionando!');
        });
        // ✅ Montar o Roteador de Autenticação
        app.use('/api/auth', authRouter); 

        // ✅ Montar o Roteador de Mídia
        app.use('/api/media', mediaRouter); 

        // ✅ Montar o Roteador de Comentários
        app.use('/api/comment', commentRouter);         

        // Iniciar el servidor Express SÓLO después de la conexión exitosa
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express rodando en la porta: http://localhost:${PORT}`);
        });

    } catch (error) {
        // Si connectDB lanza un error, se maneja aquí (aunque connectDB ya hace process.exit(1))
        console.error('❌ Fallo al iniciar la aplicación:', error);
    }
};

// Ejecuta la función de inicio
startServer();
