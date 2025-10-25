
// 🛑 BLOCO DE CARREGAMENTO CRÍTICO (DEVE SER O PRIMEIRO) 🛑
import dotenv from 'dotenv';
import path from 'path'; 
import { fileURLToPath } from 'url';
// ... (restante do bloco dotenv) ...
// ------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envResult = dotenv.config({ // Capturamos el resultado para debug
        path: path.join(__dirname, '..', '.env')
})

// --- INÍCIO DO DEBUGGING: VERIFICAR VARIÁVEL SECRETA ---
if (envResult.error) {
    console.error('❌ ERRO AO CARREGAR .env:', envResult.error.message);
} else {
    // Verificamos se o JWT_SECRET foi carregado com sucesso
    if (process.env.JWT_SECRET) {
        console.log('✅ JWT_SECRET CARREGADO com sucesso. (Primeiros 5 caracteres):', process.env.JWT_SECRET.substring(0, 5) + '...');
    } else {
        console.error('⚠️ ATENÇÃO: JWT_SECRET NÃO FOI ENCONTRADO em process.env, verifique seu arquivo .env.');
    }
}
// --- AGORA, E SOMENTE AGORA, fazemos as importações restantes ---
import express from 'express'; 
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import expressSession from 'express-session'; 

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import connectDB from '../config/db.js';

// 🚨 CORREÇÃO CRÍTICA: Mudar .ts para .js nos imports relativos para NodeNext/ESM
import mediaRouter from '../routes/mediaRoutes.ts'; 
import commentRouter from '../routes/commentRoutes.ts';
import authRouter from '../routes/authRoutes.ts'; 
import User from '../models/User.ts'; // ✅ CORRIGIDO: Deve ser .js// --- 1. CONFIGURAÇÃO INICIAL ---
const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3000', 10);

// Define a URL do frontend a partir do .env
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

dotenv.config({
    path: path.join(__dirname, '..', '.env')
})
// --- 2. MIDDLEWARE ---
app.use(cors({
      origin: FRONTEND_URL, // Usa a variável do .env
      methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],

      credentials: true,
})); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Servir archivos estáticos (uploads)s
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const UPLOADS_ROOT_DIR_SERVER = path.join(__dirname, '..', 'uploads');
const UPLOADS_ROOT_DIR = path.join(__dirname, '..', '../uploads'); // Ajuste o nível se necessário
app.use('/uploads', express.static(UPLOADS_ROOT_DIR));
// app.use('/uploads', express.static(path.join(process.cwd(), '../uploads')));

// --- 3. CONFIGURAÇÃO E MIDDLEWARE DO PASSPORT (Sessões) ---

// Sessão Express: Passport usa sessões para manter o estado de autenticação
app.use(expressSession({
        secret: process.env.SESSION_SECRET || 'fallback_secret_key', // Usa chave do .env
        resave: false,
        saveUninitialized: false,
        cookie: { 
                maxAge: 24 * 60 * 60 * 1000, // 1 dia
                secure: process.env.NODE_ENV === 'production', // Usa 'true' em produção (HTTPS)
                sameSite: 'lax', // Permite que o cookie seja enviado em requisições OAuth
            },
}));

// Inicializa o Passport e as sessões
app.use(passport.initialize());
app.use(passport.session());


// --- 4. CONFIGURAÇÃO DA ESTRATÉGIA DO GOOGLE ---

// Serialização: Armazena apenas o ID do MongoDB na sessão
passport.serializeUser(async (id: string, done) => {
        // ✅ CORRIGIDO: Deve usar o ID interno do Mongoose (_id)
    try{
        const user = await User.findById(id).select('-password')
        //     done(null, user._id); 
        done(null, user)
    }catch (error) {
        done(error, null)
    }
});

// Desserialização: Busca o usuário completo no MongoDB a partir do ID da sessão
passport.deserializeUser(async (id: string, done) => {
        try {
                // ✅ IMPLEMENTAÇÃO REAL: Buscar o usuário no MongoDB pelo ID
                const user = await User.findById(id); 
                done(null, user);
            } catch (err) {
                    done(err, null);
                }
});


// Configura a estratégia do Google
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
},
async (accessToken, refreshToken, profile, done) => {
        try {
                // ✅ LÓGICA COMPLETA DE USUÁRIO: Buscar ou Criar (Upsert)

        // 1. Tenta encontrar o usuário pelo Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // Se o usuário existir, autentica
            return done(null, user);
        } else {
            // Se o usuário NÃO existir, cria um novo
            const email = profile.emails?.[0].value;

            if (!email) {
                return done(new Error('Email não fornecido pelo Google'), undefined);
            }

            const newUser = await User.create({
                googleId: profile.id, // Armazenamos o ID do Google
                name: profile.displayName,
                email: email,
                profileImageUrl: profile.photos?.[0].value,
            });

            return done(null, newUser);
        }

    } catch (err) {
        done(err as Error);
    }
}));

// --- 5. INICIO DE LA APLICACIÓN ---
const startServer = async () => {
const HOST = '0.0.0.0';
        try {
        // 🛑 Llama a la función de conexión a la base de datos
        await connectDB(); 

        // --- 6. ROTAS PRINCIPAIS E DE AUTENTICAÇÃO ---
        app.get('/', (req: Request, res: Response) => {
            res.send('Backend Server está funcionando!');
        });
            
        // ✅ Montar Roteadores
        app.use('/api/auth', authRouter); 
        app.use('/api/media', mediaRouter); 
        app.use('/api/comment', commentRouter);         

        // ROTA 1: Inicia o fluxo de autenticação do Google
        app.get('/auth/google',
                passport.authenticate('google', { 
                                      scope: ['profile', 'email']
                })
                  );

                    // ROTA 2: Rota de callback após o Google autenticar
                app.get('/auth/google/callback',
                        passport.authenticate('google', { 
                                              // ✅ CORRIGIDO: Usa a URL completa do frontend para redirecionamento
                                              failureRedirect: `${FRONTEND_URL}/#/login` 
                        }),
                        // Redireciona em caso de sucesso
                        (req: Request, res: Response) => {
                                // Redireciona para a página principal do frontend
                            res.redirect(`${FRONTEND_URL}/#/`);
                        }
                       );        

                       // Iniciar el servidor Express SÓ após a conexão bem-sucedida
                       app.listen(PORT, () => {
                           console.log(`🚀 Servidor Express rodando na porta: http://localhost:${PORT}:${PORT}`);
                       });
    } catch (error) {
        console.error('❌ Fallo al iniciar la aplicación:', error);
    }
};

// Ejecuta la función de inicio
startServer();
