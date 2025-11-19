// server/src/routes/userRoutes.ts

import express from 'express';
// Removidos: registerUser (pertence a authRouter), authenticate (usamos 'protect'), upload (usaremos 'uploadMiddleware')
import { getProfile, updateUserDetails, updateAvatar } from '../controllers/userController.ts'; 
import { protect, uploadMiddleware } from '../middlewares/authMiddleware.ts'; // Usando .js para ESM
import { upload } from '../middlewares/uploadMiddleware.ts'; // Assumindo que este é o middleware do Multer

const router = express.Router();

/**
 * @route GET /api/users/edit-profile
 * @description Rota para obter detalhes do perfil do usuário logado.
 * @access Private
 */
router.get('/details', protect, getProfile);



// Rotas de Gerenciamento de Perfil (Montadas em /api/users)
router.patch('/details', protect, updateUserDetails);
router.patch('/avatar', protect, upload.single('avatar'), updateAvatar);

export default router;
