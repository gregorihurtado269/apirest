import { Router } from 'express';
import {
  createRecipe,
  updateRecipe,
  getRecipeById,
  getAllRecipes,
  findByIngredients,
  findByProximity,
  getByType,
  getByDifficulty,
  getPopular,
  getRecommended,
  rateRecipe,
  cookRecipe,
  getRecipesByIds,
  getMyRating,
} from '../controllers/recipeController';

const router = Router();

// --- Búsquedas específicas y acciones sobre receta (antes de los genéricos) ---
router.post('/find', findByIngredients);                   // Buscar recetas por ingredientes (todos)
router.post('/by-proximity', findByProximity);             // Buscar recetas por cercanía de ingredientes
router.get('/type/:type', getByType);                      // Buscar por tipo
router.get('/difficulty/:difficulty', getByDifficulty);    // Buscar por dificultad
router.get('/popular', getPopular);                        // Recetas populares
router.get('/recommended/:userId', getRecommended);        // Recomendadas para usuario

router.post('/:id/rate', rateRecipe);                      // Calificar receta
router.post('/:id/cook', cookRecipe);                      // Cocinar receta (resta ingredientes del fridge)

// ¡IMPORTANTE! El batch va antes de '/:id' para evitar conflictos:
router.post('/batch', getRecipesByIds);                    // Obtener recetas por varios IDs (máx 25)

// Obtener rating del usuario para una receta (antes del genérico '/:id')
router.get('/:id/rating/:userId', getMyRating);

// --- CRUD estándar ---
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);                         // Siempre al final (¡deja esto al último!)

export default router;
