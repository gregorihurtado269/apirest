import User, { IUser } from '../models/User';

class UserRepository {
  /**
   * Crea un usuario nuevo asegurando que el email y username se almacenen en minúsculas y sin espacios.
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    if (userData.email) {
      userData.email = userData.email.trim().toLowerCase();
    }
    if (userData.username) {
      userData.username = userData.username.trim().toLowerCase();
    }
    return await User.create(userData);
  }

  /**
   * Busca un usuario por email, normalizando el correo.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.trim().toLowerCase() });
  }

  /**
   * Busca un usuario por username, normalizando el username.
   */
  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username: username.trim().toLowerCase() });
  }

  /**
   * Busca un usuario por ID.
   */
  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  /**
   * Actualiza un usuario por ID.
   */
  async updateById(id: string, update: Partial<IUser>): Promise<IUser | null> {
    if (update.email) {
      update.email = update.email.trim().toLowerCase();
    }
    if (update.username) {
      update.username = update.username.trim().toLowerCase();
    }
    return await User.findByIdAndUpdate(id, update, { new: true });
  }

  /**
   * Elimina un usuario por ID.
   */
  async deleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
}

export default new UserRepository();
