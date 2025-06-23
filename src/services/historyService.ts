import historyRepository from '../repositories/historyRepository';

class HistoryService {
  // Obtener el historial del usuario con los datos completos de las recetas (populate)
  async getUserHistory(userId: string) {
    return await historyRepository.getByUserIdPopulated(userId);
  }

  // Agregar una receta al historial
  async addRecipeToHistory(userId: string, recipeId: string) {
    return await historyRepository.addRecipe(userId, recipeId);
  }
  async clearUserHistory(userId: string) {
  // Si usas items: []
  return await historyRepository.clearHistory(userId);
  }

}

export default new HistoryService();
