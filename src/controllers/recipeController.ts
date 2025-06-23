import { Request, Response, NextFunction } from 'express';
import recipeService from '../services/recipeService';

// Crear nueva receta
export const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipe = await recipeService.createRecipe(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

// Actualizar receta
export const updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipe = await recipeService.updateRecipe(req.params.id, req.body);
    if (!recipe) {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// Obtener receta por ID
export const getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    if (!recipe) {
      res.status(404).json({ error: 'Receta no encontrada' });
      return;
    }
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// Listar todas las recetas
export const getAllRecipes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await recipeService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Buscar recetas donde TODOS los ingredientes están en la lista enviada
// Body: { "ingredients": [array de IDs] }
export const findByIngredients = async (req: Request, res: Response, next: NextFunction) => {
  console.log('IDs que llegan:', req.body.ingredients);
  try {
    const ingredientIds: string[] = req.body.ingredients || [];
    if (!ingredientIds.length) {
      res.status(400).json({ error: 'Debes enviar una lista de ingredientes.' });
      return;
    }
    const recipes = await recipeService.findRecipesByIngredients(ingredientIds);
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Buscar por tipo
export const getByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await recipeService.getRecipesByType(req.params.type);
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Buscar por dificultad
export const getByDifficulty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await recipeService.getRecipesByDifficulty(req.params.difficulty);
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Recetas populares
export const getPopular = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await recipeService.getPopularRecipes();
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Recomendadas para usuario
export const getRecommended = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipes = await recipeService.getRecommendedRecipes(req.params.userId);
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// Calificar receta (1-5 estrellas)
// Body: { userId, value }
export const rateRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, value } = req.body;
    const recipeId = req.params.id;
    if (!userId || typeof value !== 'number' || value < 1 || value > 5) {
      res.status(400).json({ error: 'userId y valor de calificación (1-5) requeridos.' });
      return;
    }
    const recipe = await recipeService.rateRecipe(recipeId, userId, value);
    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// "Cocinar" receta: descuenta ingredientes del fridge del usuario
// Body: { userId }
export const cookRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipeId = req.params.id;
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId requerido.' });
      return;
    }
    const fridgeItems = await recipeService.cookRecipe(recipeId, userId);
    res.json({ fridge: fridgeItems });
  } catch (error) {
    next(error);
  }
};
