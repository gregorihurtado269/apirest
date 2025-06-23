import { Request, Response, NextFunction, RequestHandler } from 'express';
import favoriteService from '../services/favoriteService';

export const getFavorites: RequestHandler = async (req, res, next) => {
  try {
    const favorites = await favoriteService.getFavoritesByUserId(req.params.userId);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

export const addFavorite: RequestHandler = async (req, res, next) => {
  try {
    const favorite = await favoriteService.addFavorite(req.params.userId, req.params.recipeId);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar favorito' });
  }
};

export const removeFavorite: RequestHandler = async (req, res, next) => {
  try {
    const favorite = await favoriteService.removeFavorite(req.params.userId, req.params.recipeId);
    res.json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
};
