import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

/**
 * Registro de usuario (requiere: name, username, email, password)
 */
router.post('/register', register);

/**
 * Login de usuario (por email o username)
 * Body: { emailOrUsername, password }
 */
router.post('/login', login);

export default router;
