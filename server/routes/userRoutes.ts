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
router.get('/edit-profile', protect, getProfile);

/**
 * @route PATCH /api/users/edit-profile
 * @description Rota para atualizar detalhes de texto do perfil (nome, email, senha).
 * @access Private
 */
router.patch('/edit-profile', protect, updateUserDetails);


/**
 * @route PATCH /api/users/update-avatar
 * @description Rota para fazer upload e atualizar a imagem do perfil (avatar).
 * @access Private
 */
// ** CORREÇÃO: Usar apenas UMA ROTA para update-avatar. **
// Se 'uploadMiddleware' já inclui a lógica do Multer e 'protect', use apenas ele.
// Se precisar do Multer separado, use a versão 'upload.single'
router.patch(
    '/update-avatar',
    protect, // Garante que o usuário está logado
    // uploadMiddleware, // Use esta, ou a linha de baixo. 
    upload.single('avatar'), // Nome do campo do formulário: 'avatar'
    updateAvatar // O controller que lida com o arquivo
);


// Rota de registro (Provavelmente DEVE estar em authRoutes, mas a mantive aqui, corrigindo o controller)
// ** ATENÇÃO: Se `registerUser` está em `authController`, mova esta rota para `authRoutes.ts` **
// router.post(
//     '/register', 
//     upload.single('profileImage'), 
//     registerUser
// );


export default router;
