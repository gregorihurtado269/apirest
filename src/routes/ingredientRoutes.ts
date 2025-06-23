// routes/ingredientRoutes.ts
import { Router } from 'express';
import { addIngredient, getAllIngredients, updateIngredient } from '../controllers/ingredientController';

const router = Router();
router.get('/', getAllIngredients);
router.post('/', addIngredient);
router.put('/:id', updateIngredient);

export default router;
