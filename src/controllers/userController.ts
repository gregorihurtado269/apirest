import bcrypt from 'bcrypt';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import userService from '../services/userService';

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Cambiar contraseña solo si se pasan ambos campos
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ error: 'Contraseña incorrecta' });
        return;
      }
      req.body.passwordHash = await bcrypt.hash(req.body.newPassword, 10);
      delete req.body.currentPassword;
      delete req.body.newPassword;
    }

    if (req.body.password) delete req.body.password;

    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
