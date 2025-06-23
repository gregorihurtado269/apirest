import favoriteRepository from '../repositories/favoriteRepository';
import { IFavorite } from '../models/Favorite';

class FavoriteService {
  async getFavoritesByUserId(userId: string): Promise<IFavorite | null> {
    return await favoriteRepository.findByUserId(userId);
  }

  async addFavorite(userId: string, recipeId: string): Promise<IFavorite> {
    return await favoriteRepository.addFavorite(userId, recipeId);
  }

  async removeFavorite(userId: string, recipeId: string): Promise<IFavorite | null> {
    return await favoriteRepository.removeFavorite(userId, recipeId);
  }
}

export default new FavoriteService();
