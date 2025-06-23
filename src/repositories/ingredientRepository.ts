// repositories/ingredientRepository.ts
import Ingredient, { IIngredient } from '../models/Ingredient';

class IngredientRepository {
  async create(data: Partial<IIngredient>): Promise<IIngredient> {
    return Ingredient.create(data);
  }

  async findByName(name: string): Promise<IIngredient | null> {
    return Ingredient.findOne({ name });
  }

  async findAll(): Promise<IIngredient[]> {
    return Ingredient.find().sort({ name: 1 });
  }

  async updateById(id: string, data: Partial<IIngredient>): Promise<IIngredient | null> {
    return Ingredient.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new IngredientRepository();
