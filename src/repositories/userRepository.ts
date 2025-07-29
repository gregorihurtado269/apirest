import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Profile from '../models/Profile';
import Favorite from '../models/Favorite';
import Fridge from '../models/Fridge';
import History from '../models/History';
import Recipe from '../models/Recipe';
// Si tienes más modelos relacionados, impórtalos aquí

import {
  isValidEmail,
  isValidName,
  isValidUsername,
  isEmailTaken,
  isUsernameTaken
} from '../utils/validators';

class UserRepository {
  /**
   * Crea un usuario nuevo asegurando validaciones profesionales.
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    if (!userData.name || !isValidName(userData.name)) {
      throw new Error('El nombre solo debe contener letras y espacios.');
    }
    if (!userData.username || !isValidUsername(userData.username)) {
      throw new Error('El usuario solo puede contener letras, números, guion bajo y punto.');
    }
    if (!userData.email || !isValidEmail(userData.email)) {
      throw new Error('El correo electrónico no es válido.');
    }
    userData.email = userData.email.trim().toLowerCase();
    userData.username = userData.username.trim().toLowerCase();

    if (await isEmailTaken(userData.email)) {
      throw new Error('El correo electrónico ya está registrado.');
    }
    if (await isUsernameTaken(userData.username)) {
      throw new Error('El nombre de usuario ya está en uso.');
    }

    return await User.create(userData);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.trim().toLowerCase() });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username: username.trim().toLowerCase() });
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async updateById(id: string, update: Partial<IUser>): Promise<IUser | null> {
    if (update.email) {
      if (!isValidEmail(update.email)) {
        throw new Error('El correo electrónico no es válido.');
      }
      update.email = update.email.trim().toLowerCase();
      if (await isEmailTaken(update.email, id)) {
        throw new Error('El correo electrónico ya está registrado.');
      }
    }
    if (update.username) {
      if (!isValidUsername(update.username)) {
        throw new Error('El usuario solo puede contener letras, números, guion bajo y punto.');
      }
      update.username = update.username.trim().toLowerCase();
      if (await isUsernameTaken(update.username, id)) {
        throw new Error('El nombre de usuario ya está en uso.');
      }
    }
    if (update.name && !isValidName(update.name)) {
      throw new Error('El nombre solo debe contener letras y espacios.');
    }
    return await User.findByIdAndUpdate(id, update, { new: true });
  }

  /**
   * Elimina un usuario por ID y borra todo lo relacionado en cascada,
   * incluyendo ratings embebidos en recetas y recalculando los promedios.
   */
  async deleteById(id: string): Promise<IUser | null> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await User.findByIdAndDelete(id, { session });

      if (user) {
        await Profile.deleteOne({ userId: id }, { session });
        await Favorite.deleteMany({ userId: id }, { session });
        await Fridge.deleteMany({ userId: id }, { session });
        await History.deleteMany({ userId: id }, { session });

        // Eliminar ratings embebidos del usuario en TODAS las recetas
        await Recipe.updateMany(
          { 'ratings.userId': id },
          { $pull: { ratings: { userId: id } } },
          { session }
        );

        // Recalcular promedios y conteos de ratings para cada receta afectada
        const affectedRecipes = await Recipe.find({ 'ratings.userId': id }, null, { session });
        for (const recipe of affectedRecipes) {
          if (recipe.ratings && recipe.ratings.length > 0) {
            recipe.ratingCount = recipe.ratings.length;
            recipe.ratingTotal = recipe.ratings.reduce((sum, r) => sum + r.value, 0);
            recipe.rating = recipe.ratingTotal / recipe.ratingCount;
          } else {
            recipe.ratingCount = 0;
            recipe.ratingTotal = 0;
            recipe.rating = 0;
          }
          await recipe.save({ session });
        }
      }

      await session.commitTransaction();
      return user;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}

export default new UserRepository();
