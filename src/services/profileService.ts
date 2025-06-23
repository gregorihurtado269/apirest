import profileRepository from '../repositories/profileRepository';
import { IProfile } from '../models/Profile';

class ProfileService {
  async saveOrUpdateProfile(userId: string, data: Partial<IProfile>): Promise<IProfile> {
    return await profileRepository.upsert(userId, data);
  }

  async getProfileByUserId(userId: string): Promise<IProfile | null> {
    return await profileRepository.findByUserId(userId);
  }
}

export default new ProfileService();
