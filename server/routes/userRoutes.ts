// server/src/routes/userRoutes.ts (Exemplo)

import express from 'express';
import { registerUser } from '../controllers/userController';
import { upload } from '../middleware/upload';

const router = express.Router();

// A rota agora espera 'username', 'email', 'password' (textos) 
// E um arquivo chamado 'profileImage' (file)
router.post(
    '/register', 
    upload.single('profileImage'), // O nome 'profileImage' deve corresponder ao campo do formulário do frontend
    registerUser
);

export default router;
