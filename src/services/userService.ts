import userRepository from '../repositories/userRepository';
import { IUser } from '../models/User';

class UserService {
  async getUserById(id: string): Promise<IUser | null> {
    return await userRepository.findById(id);
  }

  async updateUser(id: string, update: Partial<IUser>): Promise<IUser | null> {
    return await userRepository.updateById(id, update);
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await userRepository.deleteById(id);
  }
}

export default new UserService();
