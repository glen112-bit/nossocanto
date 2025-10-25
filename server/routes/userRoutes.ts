// server/src/routes/userRoutes.ts (Exemplo)

import express from 'express';
import { registerUser } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { upload } from '../middleware/upload';
import { userController } from '../controllers/userController'

const router = express.Router();

// A rota agora espera 'username', 'email', 'password' (textos) 
// E um arquivo chamado 'profileImage' (file)
router.patch(
    '/update-avatar',
    authenticate,
    upload.single('avatar'),
    userController.updateAvatar
)

router.post(
    '/register', 
    upload.single('profileImage'), // O nome 'profileImage' deve corresponder ao campo do formulário do frontend
    registerUser
);

export default router;
