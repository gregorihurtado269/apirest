import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoriteController';

const router = Router();

router.get('/:userId', getFavorites);
router.post('/:userId/:recipeId', addFavorite);
router.delete('/:userId/:recipeId', removeFavorite);

export default router;
