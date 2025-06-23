import Favorite, { IFavorite } from '../models/Favorite';

class FavoriteRepository {
  async findByUserId(userId: string): Promise<IFavorite | null> {
  // Popula tanto recipes como ingredients de cada recipe
  return await Favorite.findOne({ userId })
    .populate({
      path: 'recipes',
      populate: { path: 'ingredients' } // Aquí está la magia
    });
}
  async addFavorite(userId: string, recipeId: string): Promise<IFavorite> {
    return await Favorite.findOneAndUpdate(
      { userId },
      { $addToSet: { recipes: recipeId } },
      { upsert: true, new: true }
    );
  }

  async removeFavorite(userId: string, recipeId: string): Promise<IFavorite | null> {
    return await Favorite.findOneAndUpdate(
      { userId },
      { $pull: { recipes: recipeId } },
      { new: true }
    );
  }
}

export default new FavoriteRepository();
