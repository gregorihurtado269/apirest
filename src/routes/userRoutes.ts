import { Router } from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

/**
 * Obtener usuario por ID
 */
router.get('/:id', getUser);

/**
 * Actualizar usuario por ID
 */
router.put('/:id', updateUser);

/**
 * Eliminar usuario por ID
 */
router.delete('/:id', deleteUser);

export default router;
