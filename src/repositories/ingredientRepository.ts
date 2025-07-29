// repositories/ingredientRepository.ts
import Ingredient, { IIngredient } from '../models/Ingredient';

class IngredientRepository {
  async create(data: Partial<IIngredient>): Promise<IIngredient> {
    return Ingredient.create(data);
  }

  async findByName(name: string): Promise<IIngredient | null> {
    return Ingredient.findOne({ name });
  }

  async findById(id: string): Promise<IIngredient | null> {  // Nuevo método para buscar por ID
    return Ingredient.findById(id);
  }

  async findAll(): Promise<IIngredient[]> {
    return Ingredient.find().sort({ name: 1 });
  }

  async updateById(id: string, data: Partial<IIngredient>): Promise<IIngredient | null> {
    return Ingredient.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new IngredientRepository();
