import { RequestHandler } from 'express';
import historyService from '../services/historyService';

export const getHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    // Usa el método populado para que ya vengan las recetas
    const history = await historyService.getUserHistory(userId);
    res.json({ items: history?.items ?? [] }); // Aquí cambias recipes -> items
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};

export const addToHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { recipeId } = req.body;
    // Actualiza y devuelve items populados
    const history = await historyService.addRecipeToHistory(userId, recipeId);
    res.json({ success: true, items: history.items });
  } catch (e) {
    res.status(500).json({ error: 'Error al guardar en el historial' });
  }
};
export const clearHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    await historyService.clearUserHistory(userId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al borrar el historial' });
  }
};
