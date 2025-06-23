import Profile, { IProfile } from '../models/Profile';

class ProfileRepository {
  /**
   * Inserta o actualiza el perfil de un usuario.
   */
  async upsert(userId: string, profileData: Partial<IProfile>): Promise<IProfile> {
    return await Profile.findOneAndUpdate(
      { userId },
      { $set: profileData },
      { upsert: true, new: true }
    );
  }

  /**
   * Busca el perfil por ID de usuario.
   */
  async findByUserId(userId: string): Promise<IProfile | null> {
    return await Profile.findOne({ userId });
  }
}

export default new ProfileRepository();
