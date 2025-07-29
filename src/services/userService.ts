import userRepository from '../repositories/userRepository';
import { IUser } from '../models/User';
import {
  isValidName,
  isValidUsername,
  isValidEmail,
  isEmailTaken,
  isUsernameTaken,
} from '../utils/validators';

class UserService {
  async getUserById(id: string): Promise<IUser | null> {
    return await userRepository.findById(id);
  }

  async updateUser(id: string, update: Partial<IUser>): Promise<IUser | null> {
    // Validaciones antes de actualizar
    if (update.name && !isValidName(update.name)) {
      throw new Error('El nombre solo debe contener letras y espacios.');
    }
    if (update.username && !isValidUsername(update.username)) {
      throw new Error('El usuario solo puede contener letras, números, guion bajo y punto.');
    }
    if (update.email && !isValidEmail(update.email)) {
      throw new Error('El correo electrónico no es válido.');
    }
    if (update.email && await isEmailTaken(update.email, id)) {
      throw new Error('El correo electrónico ya está registrado.');
    }
    if (update.username && await isUsernameTaken(update.username, id)) {
      throw new Error('El nombre de usuario ya está en uso.');
    }

    return await userRepository.updateById(id, update);
  }

  /**
   * Elimina un usuario y todas sus interacciones asociadas (borrado en cascada y recalculo de ratings en recetas).
   * El repositorio se encarga de:
   *  - Eliminar el usuario y su perfil.
   *  - Eliminar favoritos, nevera, historial.
   *  - Remover ratings embebidos en recetas y recalcular promedios y conteos.
   */
  async deleteUser(id: string): Promise<IUser | null> {
    return await userRepository.deleteById(id);
  }
}

export default new UserService();
