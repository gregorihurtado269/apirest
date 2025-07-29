import bcrypt from 'bcrypt';
import { RequestHandler } from 'express';
import userService from '../services/userService';
import User from '../models/User';
import Profile from '../models/Profile';
import { isStrongPassword } from '../utils/validators';

/**
 * Obtener usuario por ID.
 */
export const getUser: RequestHandler = async (req, res) => {
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

/**
 * Actualizar usuario (incluye cambio de contraseña).
 */
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    // Cambio de contraseña (solo si ambos campos vienen)
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
      if (!isMatch) {
        res.status(400).json({ error: 'Contraseña actual incorrecta' });
        return;
      }
      if (!isStrongPassword(req.body.newPassword)) {
        res.status(400).json({
          error: 'La nueva contraseña debe tener mínimo 8 caracteres, incluyendo mayúsculas, minúsculas, números y signos.'
        });
        return;
      }
      req.body.passwordHash = await bcrypt.hash(req.body.newPassword, 10);
      delete req.body.currentPassword;
      delete req.body.newPassword;
    }

    if (req.body.password) delete req.body.password;

    // Actualiza usuario
    let updatedUser;
    try {
      updatedUser = await userService.updateUser(req.params.id, req.body);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }

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

/**
 * Eliminar usuario y todo lo relacionado (borrado en cascada).
 * El userService se encarga de:
 *  - Eliminar el usuario y su perfil.
 *  - Eliminar favoritos, nevera, historial.
 *  - Remover ratings embebidos en recetas y recalcular promedios y conteos.
 */
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }
    res.json({ message: 'Usuario eliminado correctamente (todas sus interacciones también fueron eliminadas).' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

/**
 * Obtener todos los usuarios.
 */
export const getAllUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
};

/**
 * Obtener perfil por userId.
 */
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({ error: 'Perfil no encontrado' });
      return;
    }
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Unknown error" });
  }
};
