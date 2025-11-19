// server/routes/authRoutes.ts (Exemplo Completo)

import express from 'express';
import { registerUser, loginUser , getMe } from '../controllers/authController.ts'; 
import { updateUserDetails, updateAvatar } from '../controllers/userController.ts'; 
import { upload } from '../middlewares/uploadMiddleware.ts'
import { protect } from '../middlewares/authMiddleware.ts'; // Importe o middleware

const router = express.Router();

// Rota POST para registrar um novo usuário
router.post('/register', upload.single('avatar') ,registerUser);

// Rota POST para autenticar e logar
router.post('/login', loginUser);
// NOVA ROTA: Retorna os dados do usuário se estiver logado
router.get('/me', protect, getMe);
// router.patch('/details', protect, updateUserDetails);
// router.patch('/avatar', protect, upload.single('avatar'), updateAvatar);


export default router;
