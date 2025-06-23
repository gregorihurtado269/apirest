import { Request, Response, NextFunction, RequestHandler } from 'express';
import authService from '../services/authService';

/**
 * Registro de usuario (incluye username).
 */
export const register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await authService.register(name, username, email, password);
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en registro' });
  }
};

/**
 * Login (por email o username).
 */
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    const result = await authService.login(emailOrUsername, password);

    if (!result) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Retorna token y datos del usuario
    const { token, user } = result;
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en login' });
  }
};
