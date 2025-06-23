import { RequestHandler } from 'express';
import ingredientService from '../services/ingredientService';

// Agregar ingrediente
export const addIngredient: RequestHandler = async (req, res) => {
  try {
    const { name, units, defaultUnit, category } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto válido.' });
      return;
    }
    const ingredient = await ingredientService.addIngredient({ name: name.trim(), units, defaultUnit, category });
    res.status(201).json(ingredient);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar ingrediente' });
    return;
  }
};

// Obtener todos los ingredientes
export const getAllIngredients: RequestHandler = async (_req, res) => {
  try {
    const ingredients = await ingredientService.getAllIngredients();
    res.json(ingredients);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ingredientes' });
    return;
  }
};

// Actualizar ingrediente
export const updateIngredient: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, units, defaultUnit, category } = req.body;
    const ingredient = await ingredientService.updateIngredient(id, { name, units, defaultUnit, category });
    if (!ingredient) {
      res.status(404).json({ error: 'Ingrediente no encontrado.' });
      return;
    }
    res.json(ingredient);
    return;
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ingrediente' });
    return;
  }
};
