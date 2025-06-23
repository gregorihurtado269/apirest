import userRepository from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

class AuthService {
  async register(name: string, username: string, email: string, password: string): Promise<IUser> {
    const passwordHash = await bcrypt.hash(password, 10);
    return await userRepository.create({ name, username, email, passwordHash });
  }

  async login(emailOrUsername: string, password: string): Promise<{ token: string, user: IUser } | null> {
    // Permite login por email o por username
    let user = await userRepository.findByEmail(emailOrUsername);
    if (!user) {
      user = await userRepository.findByUsername(emailOrUsername);
    }
    console.log('Usuario encontrado:', user);

    if (!user || !user.passwordHash) {
      console.log('Usuario no encontrado o sin passwordHash');
      return null;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log('¿Password coincide?', valid);

    if (!valid) {
      console.log('Contraseña incorrecta');
      return null;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '7d' }
    );
    return { token, user };
  }
}

export default new AuthService();
