import { Router } from 'express';
import {
  createRecipe,
  updateRecipe,
  getRecipeById,
  getAllRecipes,
  findByIngredients,
  getByType,
  getByDifficulty,
  getPopular,
  getRecommended,
  rateRecipe,
  cookRecipe,
} from '../controllers/recipeController';

const router = Router();

// --- Búsquedas específicas y acciones sobre receta (antes de los genéricos) ---
router.post('/find', findByIngredients);                 // Buscar recetas por ingredientes (body: [ids])
router.get('/type/:type', getByType);                    // Buscar por tipo
router.get('/difficulty/:difficulty', getByDifficulty);  // Buscar por dificultad
router.get('/popular', getPopular);                      // Recetas populares
router.get('/recommended/:userId', getRecommended);      // Recomendadas para usuario

router.post('/:id/rate', rateRecipe);                    // Calificar receta
router.post('/:id/cook', cookRecipe);                    // Cocinar receta (resta ingredientes del fridge)

// --- CRUD estándar ---
router.post('/', createRecipe);
router.put('/:id', updateRecipe);                        // Actualizar receta
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);                       // Siempre al final

export default router;
