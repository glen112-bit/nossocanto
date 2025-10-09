// server/routes/authRoutes.ts (Exemplo Completo)

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.ts'; 

const router = express.Router();

// Rota POST para registrar um novo usuário
router.post('/register', registerUser);

// Rota POST para autenticar e logar
router.post('/login', loginUser);

export default router;
