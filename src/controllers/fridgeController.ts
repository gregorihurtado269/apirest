import { RequestHandler } from 'express';
import fridgeService from '../services/fridgeService';

// Correcto: No retornes el res.json
export const getFridge: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Falta userId' });
      return;
    }
    const fridge = await fridgeService.getFridgeByUserId(userId);
    res.json(fridge?.items ?? []);
  } catch (error) {
    res.status(500).json({ error: String(error) || 'Error al obtener nevera' });
  }
};

export const addOrUpdateIngredients: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = req.body.items;
    if (!userId || !Array.isArray(items)) {
      res.status(400).json({ error: 'userId y items requeridos' });
      return;
    }
    const fridge = await fridgeService.addOrUpdateIngredients(userId, items);
    res.status(201).json(fridge);
  } catch (error) {
    res.status(500).json({ error: String(error) || 'Error al agregar ingredientes' });
  }
};

export const removeIngredients: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const ingredientIds = req.body.ingredients;
    if (!userId || !Array.isArray(ingredientIds)) {
      res.status(400).json({ error: 'userId y lista de ingredients requerida' });
      return;
    }
    const fridge = await fridgeService.removeIngredients(userId, ingredientIds);
    res.json(fridge);
  } catch (error) {
    res.status(500).json({ error: String(error) || 'Error al eliminar ingredientes' });
  }
};

export const updateIngredients: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = req.body.items;
    if (!userId || !Array.isArray(items)) {
      res.status(400).json({ error: 'userId y items requeridos' });
      return;
    }
    const fridge = await fridgeService.updateIngredients(userId, items);
    res.json(fridge);
  } catch (error) {
    res.status(500).json({ error: String(error) || 'Error al actualizar nevera' });
  }
};
