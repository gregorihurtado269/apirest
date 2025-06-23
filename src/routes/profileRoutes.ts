import { Router } from 'express';
import { saveProfileAnswers, getProfile } from '../controllers/profileController';

const router = Router();

/**
 * Guardar o actualizar respuestas de perfil para el usuario dado
 */
router.post('/:id/profile-questions', saveProfileAnswers);

/**
 * Obtener perfil del usuario
 */
router.get('/:id/profile-questions', getProfile);

export default router;
