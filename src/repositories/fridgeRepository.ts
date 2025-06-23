import Fridge, { IFridge, IFridgeItem } from '../models/Fridge';
import { Types } from 'mongoose';

class FridgeRepository {
  async findByUserId(userId: string): Promise<IFridge | null> {
    return await Fridge.findOne({ userId }).populate('items.ingredient');
  }

  async addOrUpdateIngredients(
    userId: string,
    items: { ingredient: string; quantity: number; unit: string }[]
  ): Promise<IFridge> {
    let fridge = await Fridge.findOne({ userId });
    if (!fridge) {
      fridge = new Fridge({ userId, items: [] });
    }

    for (const { ingredient, quantity, unit } of items) {
      const normalizedUnit = unit.trim().toLowerCase();
      const idx = fridge.items.findIndex(
        (item) =>
          item.ingredient.toString() === ingredient &&
          item.unit.trim().toLowerCase() === normalizedUnit
      );
      if (idx > -1) {
        fridge.items[idx].quantity += quantity;
        if (fridge.items[idx].quantity <= 0) {
          fridge.items.splice(idx, 1);
        }
      } else if (quantity > 0) {
        fridge.items.push({
          ingredient: new Types.ObjectId(ingredient),
          quantity,
          unit: normalizedUnit,
          addedAt: new Date()
        } as IFridgeItem);
      }
    }
    await fridge.save();
    return fridge;
  }

  // Elimina SOLO los ingredientes específicos (por id)
  async removeIngredients(userId: string, ingredientIds: string[]): Promise<IFridge | null> {
    return await Fridge.findOneAndUpdate(
      { userId },
      { $pull: { items: { ingredient: { $in: ingredientIds.map((id) => new Types.ObjectId(id)) } } } },
      { new: true }
    );
  }

  // Sobrescribe toda la nevera con nuevos items
  async updateIngredients(userId: string, items: IFridgeItem[]): Promise<IFridge | null> {
    return await Fridge.findOneAndUpdate({ userId }, { $set: { items } }, { new: true });
  }
}

export default new FridgeRepository();
