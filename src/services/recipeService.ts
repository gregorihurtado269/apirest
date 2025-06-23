import recipeRepository from '../repositories/recipeRepository';
import fridgeRepository from '../repositories/fridgeRepository';
import { IRecipe } from '../models/Recipe';

class RecipeService {
  // Crear una nueva receta
  async createRecipe(data: Partial<IRecipe>): Promise<IRecipe> {
    return await recipeRepository.create(data);
  }

  // Actualizar receta existente
  async updateRecipe(id: string, data: Partial<IRecipe>): Promise<IRecipe | null> {
    return await recipeRepository.updateById(id, data);
  }

  // Obtener receta por ID
  async getRecipeById(id: string): Promise<IRecipe | null> {
    return await recipeRepository.findById(id);
  }

  // Listar todas las recetas
  async getAllRecipes(): Promise<IRecipe[]> {
    return await recipeRepository.findAll();
  }

  // Buscar recetas por ingredientes (TODOS los ingredientes deben estar)
  async findRecipesByIngredients(ingredientIds: string[]): Promise<IRecipe[]> {
    return await recipeRepository.findByIngredients(ingredientIds);
  }

  // Buscar recetas por tipo
  async getRecipesByType(type: string): Promise<IRecipe[]> {
    return await recipeRepository.findByType(type);
  }

  // Buscar recetas por dificultad
  async getRecipesByDifficulty(difficulty: string): Promise<IRecipe[]> {
    return await recipeRepository.findByDifficulty(difficulty);
  }

  // Obtener recetas populares
  async getPopularRecipes(): Promise<IRecipe[]> {
    return await recipeRepository.findPopular();
  }

  // Obtener recetas recomendadas para usuario
  async getRecommendedRecipes(userId: string): Promise<IRecipe[]> {
    return await recipeRepository.findRecommended(userId);
  }

  // Calificar receta
  async rateRecipe(recipeId: string, userId: string, value: number): Promise<IRecipe | null> {
    return await recipeRepository.rateRecipe(recipeId, userId, value);
  }

  // "Cocinar" receta: descuenta ingredientes del fridge del usuario
  async cookRecipe(recipeId: string, userId: string): Promise<any> {
    const recipe = await this.getRecipeById(recipeId);
    if (!recipe) throw new Error('Receta no encontrada');

    const fridge = await fridgeRepository.findByUserId(userId);
    if (!fridge) throw new Error('No tienes ingredientes en tu nevera');

    let updated = false;
    for (const rIng of recipe.ingredients) {
      const idx = fridge.items.findIndex(
        (f) => f.ingredient.toString() === rIng.ingredient.toString() && f.unit === rIng.unit
      );
      if (idx !== -1) {
        const cantidadRestar = rIng.quantity || 0;
        if (fridge.items[idx].quantity >= cantidadRestar) {
          fridge.items[idx].quantity -= cantidadRestar;
        } else {
          fridge.items[idx].quantity = 0;
        }
        updated = true;
      }
    }
    if (updated) await fridge.save();
    return fridge.items;
  }
}

export default new RecipeService();
