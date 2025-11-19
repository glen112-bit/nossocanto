// server/src/index.ts (ou app.ts)

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ----------------------------------------------------
// 🛑 BLOCO DE CARREGAMENTO CRÍTICO (DEVE SER O PRIMEIRO) 🛑
// Lógica para obter __dirname em módulos ES e carregar .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envResult = dotenv.config({ 
    path: path.join(__dirname, '..', '.env')
});
// ----------------------------------------------------

// --- INÍCIO DO DEBUGGING: VERIFICAR VARIÁVEIS ---
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
// --------------------------------------------------

// --- AGORA, E SOMENTE AGORA, fazemos as importações restantes ---
import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';
import expressSession from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import connectDB from '../config/db.js'; // ✅ CORREÇÃO: .js para NodeNext/ESM

// 🚨 CORREÇÃO CRÍTICA: Mudar .ts para .js nos imports relativos
import mediaRouter from '../routes/mediaRoutes.ts';
import commentRouter from '../routes/commentRoutes.ts';
import authRouter from '../routes/authRoutes.ts';
import usersRouter from '../routes/userRoutes.ts'; // ✅ CORRIGIDO: Nome da variável para montar a rota
import User from '../models/User.ts'; 


// --- 1. CONFIGURAÇÃO INICIAL ---
const app: Express = express();
// Removemos a chamada dotenv.config duplicada
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


// --- 2. MIDDLEWARE ---
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // ✅ CORRIGIDO: Array de strings, não string única
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ...
if (process.env.JWT_SECRET) {
    console.log('✅ JWT_SECRET CARREGADO com sucesso. (Primeiros 5 caracteres):', process.env.JWT_SECRET.substring(0, 5) + '...');
} else {
    console.error('⚠️ ATENÇÃO: JWT_SECRET NÃO FOI ENCONTRADO em process.env, verifique seu arquivo .env.');
}
// ...
// Servir archivos estáticos (uploads)
// ** ATENÇÃO: A lógica 'path.join(__dirname, '..', '../uploads')' é complexa. 
// A solução mais segura é usar o path.join com o diretório correto **
// const UPLOADS_ROOT_DIR = path.join(__dirname, '..', 'uploads'); // Assumindo que 'uploads' está na raiz do 'server'
const UPLOADS_ROOT_DIR = path.join(__dirname, '..', '..', 'uploads');
// console.log('✅ DEBUG EXPRESS: Pasta de uploads servida em:', UPLOADS_ROOT_DIR)
app.use('/uploads', express.static(UPLOADS_ROOT_DIR));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- 3. CONFIGURAÇÃO E MIDDLEWARE DO PASSPORT (Sessões) ---
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'fallback_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    },
}));

app.use(passport.initialize());
app.use(passport.session());


// --- 4. CONFIGURAÇÃO DA ESTRATÉGIA DO GOOGLE ---
passport.serializeUser((user: any, done) => { // Simplificando o tipo, se TypeScript reclamar
    done(null, user.id); // ✅ CORRIGIDO: Armazenar apenas o ID do objeto User
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id).select('-password'); // ✅ CORRIGIDO: Buscar pelo ID
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
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        } else {
            const email = profile.emails?.[0].value;
            if (!email) {
                return done(new Error('Email não fornecido pelo Google'), undefined);
            }
            
            const newUser = await User.create({
                googleId: profile.id,
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
    // const HOST = '0.0.0.0'; // Não é estritamente necessário para localhost
    
    try {
        await connectDB(); // 🛑 Conexão com a base de dados

        // --- 6. ROTAS PRINCIPAIS E DE AUTENTICAÇÃO ---
        app.get('/', (req: Request, res: Response) => {
            res.send('Backend Server está funcionando!');
        });
            
        // ✅ Montar Roteadores
        app.use('/api/auth', authRouter);
        app.use('/api/media', mediaRouter);
        app.use('/api/comment', commentRouter);
        app.use('/api/users', usersRouter); // ✅ CORRIGIDO: Montado corretamente

        // ROTA 1: Inicia o fluxo de autenticação do Google
        app.get('/auth/google',
            passport.authenticate('google', { 
                scope: ['profile', 'email']
            })
        );

        // ROTA 2: Rota de callback após o Google autenticar
        app.get('/auth/google/callback',
            passport.authenticate('google', { 
                failureRedirect: `${FRONTEND_URL}/#/login`
            }),
            // Redireciona em caso de sucesso
            (req: Request, res: Response) => {
                res.redirect(`${FRONTEND_URL}/#/`);
            }
        );

        // Iniciar el servidor Express SÓ após a conexão bem-sucedida
        app.listen(PORT, () => {
            // ✅ CORRIGIDO: Remove a duplicação de PORT na mensagem
            console.log(`🚀 Servidor Express rodando na porta: http://localhost:${PORT}`); 
        });

    } catch (error) {
        console.error('❌ Fallo al iniciar la aplicación:', error);
    }
};

// Ejecuta la función de inicio
startServer();
