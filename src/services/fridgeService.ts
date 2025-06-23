import fridgeRepository from '../repositories/fridgeRepository';
import { IFridge, IFridgeItem } from '../models/Fridge';

class FridgeService {
  async getFridgeByUserId(userId: string): Promise<IFridge | null> {
    return await fridgeRepository.findByUserId(userId);
  }

  async addOrUpdateIngredients(
    userId: string,
    items: { ingredient: string; quantity: number; unit: string }[]
  ): Promise<IFridge> {
    return await fridgeRepository.addOrUpdateIngredients(userId, items);
  }

  async removeIngredients(userId: string, ingredientIds: string[]): Promise<IFridge | null> {
    return await fridgeRepository.removeIngredients(userId, ingredientIds);
  }

  async updateIngredients(userId: string, items: IFridgeItem[]): Promise<IFridge | null> {
    return await fridgeRepository.updateIngredients(userId, items);
  }
}

export default new FridgeService();
