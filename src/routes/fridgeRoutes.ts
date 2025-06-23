import { Router } from 'express';
import {
  getFridge,
  addOrUpdateIngredients,  // <--- Usa el nombre actualizado
  removeIngredients,
  updateIngredients,
} from '../controllers/fridgeController';
// import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

// Obtiene todos los ingredientes de la nevera del usuario
router.get('/:userId', /* authMiddleware, */ getFridge);

// Agrega (o agrega y actualiza) ingredientes a la nevera
router.post('/:userId', /* authMiddleware, */ addOrUpdateIngredients);

// Elimina ingredientes de la nevera
router.delete('/:userId', /* authMiddleware, */ removeIngredients);

// Actualiza todos los ingredientes de la nevera
router.put('/:userId', /* authMiddleware, */ updateIngredients);

export default router;
