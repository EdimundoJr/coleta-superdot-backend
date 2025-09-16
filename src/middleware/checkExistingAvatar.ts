// middleware/checkExistingAvatar.ts
import { Request, Response, NextFunction } from 'express';

export const checkExistingAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Para FormData, os campos vêm como strings planas
    const existingProfilePhoto = req.body.existingProfilePhoto;

    if (existingProfilePhoto) {
      // Adicionar ao req para o multer usar
      req.body.existingProfilePhoto = existingProfilePhoto;
    }

    next();
  } catch (error) {
    console.error('Error checking existing avatar:', error);
    next();
  }
};