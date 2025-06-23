// services/ingredientService.ts
import ingredientRepository from '../repositories/ingredientRepository';
import { IIngredient } from '../models/Ingredient';

class IngredientService {
  async addIngredient(data: Partial<IIngredient>): Promise<IIngredient> {
    return ingredientRepository.create(data);
  }
  async getIngredientByName(name: string): Promise<IIngredient | null> {
    return ingredientRepository.findByName(name);
  }
  async getAllIngredients(): Promise<IIngredient[]> {
    return ingredientRepository.findAll();
  }
  async updateIngredient(id: string, data: Partial<IIngredient>): Promise<IIngredient | null> {
    return ingredientRepository.updateById(id, data);
  }
}

export default new IngredientService();
