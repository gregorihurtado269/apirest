import { Request, Response, NextFunction } from 'express';
import recipeService from '../services/recipeService';
import mongoose from 'mongoose';
import Recipe from '../models/Recipe';

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

/**
 * Buscar recetas por proximidad de ingredientes
 * Body: { "ingredients": [array de IDs] }
 * SOLO retorna recetas con al menos 1 coincidencia de ingrediente,
 * ordenadas por:
 *   1. Menor cantidad total de ingredientes (las más sencillas primero)
 *   2. Mayor porcentaje de coincidencia (más match después)
 *   3. Menor cantidad de ingredientes faltantes (menos por comprar después)
 */
export const findByProximity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ingredientIds: string[] = req.body.ingredients || [];
    if (!ingredientIds.length) {
      res.status(400).json({ error: 'Debes enviar una lista de ingredientes.' });
      return;
    }
    const results = await recipeService.findRecipesByProximity(ingredientIds);
    res.json(results);
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

// Obtener recetas por un arreglo de IDs (batch)
// Body: { ids: [array de 24-char ObjectId strings] }
export const getRecipesByIds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ids: string[] = req.body.ids || [];
    if (!Array.isArray(ids) || !ids.length) {
      res.status(400).json({ error: 'Debes enviar un arreglo de IDs' });
      return;
    }
    // Limitar a máximo 15 y validar longitud de ObjectId (24 chars)
    const limitedIds = ids.filter(id => typeof id === 'string' && id.length === 24).slice(0, 15);
    if (!limitedIds.length) {
      res.status(400).json({ error: 'IDs inválidos o vacíos.' });
      return;
    }
    const objectIds = limitedIds.map(id => new mongoose.Types.ObjectId(id));
    const recipes = await Recipe.find({ _id: { $in: objectIds } }).populate('ingredients.ingredient');
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};
// Obtener rating del usuario para una receta (usando query params)
export const getMyRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Usar params
    const recipeId = req.params.id;
    const userId = req.params.userId;

    if (!recipeId || !userId) {
      return res.status(400).json({ error: 'Se requieren recipeId y userId' });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'IDs inválidos' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }

    // Buscar el rating para ese usuario
    const ratingObj = (recipe as any).ratings?.find((r: any) => r.userId.toString() === userId);
    res.json({ rating: ratingObj?.value ?? null });
  } catch (error) {
    next(error);
  }
};