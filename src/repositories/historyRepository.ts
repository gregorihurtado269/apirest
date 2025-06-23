import History, { IHistory } from '../models/History';

class HistoryRepository {
  // Devuelve historial con populate, ordenados por viewedAt descendente
  async getByUserIdPopulated(userId: string): Promise<IHistory | null> {
    return await History.findOne({ userId })
      .populate({
        path: 'items.recipe', // Suponiendo que tu esquema es items: [{recipe, viewedAt}]
        select: '-__v' // Personaliza los campos que quieras traer
      });
  }
  async clearHistory(userId: string) {
    // items: [] si tu historial está estructurado así
    return await History.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true }
    );
  }


  // Agrega una receta al historial: elimina duplicados y pone primero la receta nueva
  async addRecipe(userId: string, recipeId: string): Promise<IHistory> {
    // Elimina cualquier aparición previa de esa receta
    await History.updateOne(
      { userId },
      { $pull: { 'items': { recipe: recipeId } } }
    );
    // Agrega la receta como la más reciente
    return await History.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: {
            $each: [{ recipe: recipeId, viewedAt: new Date() }],
            $position: 0 // Inserta al principio
          }
        }
      },
      { upsert: true, new: true }
    ).populate({
      path: 'items.recipe',
      select: '-__v'
    });
  }
}

export default new HistoryRepository();
