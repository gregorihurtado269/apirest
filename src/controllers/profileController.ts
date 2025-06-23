import { Request, Response, NextFunction, RequestHandler } from 'express';
import profileService from '../services/profileService';
import { IProfile } from '../models/Profile';

export const saveProfileAnswers: RequestHandler = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const answers = req.body;
    const updatedProfile = await profileService.saveOrUpdateProfile(userId, answers as Partial<IProfile>);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const { id: userId } = req.params;
    const profile = await profileService.getProfileByUserId(userId);
    if (!profile) {
      res.status(404).json({ error: 'Perfil no encontrado' });
      return;
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
