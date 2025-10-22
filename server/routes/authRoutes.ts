// server/routes/authRoutes.ts (Exemplo Completo)

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.ts'; 
import { upload } from '../middlewares/uploadMiddleware.ts'
import { getMe } from '../controllers/authController.ts';
import { protect } from '../middlewares/authMiddleware.ts'; // Importe o middleware

const router = express.Router();

// Rota POST para registrar um novo usuário
router.post('/register', protect,  upload.single('avatar') ,registerUser);

// Rota POST para autenticar e logar
router.post('/login', loginUser);
// NOVA ROTA: Retorna os dados do usuário se estiver logado
router.get('/me', protect, getMe);

export default router;
